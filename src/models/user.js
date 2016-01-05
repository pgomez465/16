import db			from '../database';
import credential	from 'credential';
import				'./friend';

const pw = credential();

const User = db.Model.extend({
	tableName: 'users',
	initialize(/* attributes */) {
		this.on('saving', (model, attrs) => {
			// If the user is updating the password
			if ('password' in attrs) {
				// Hash the password and save the hash
				return pw.hash(model.get('password'))
				.then((hash) => {
					model.set('password', hash);
				});
			}
		});
	},

	// Relations
	friends() {
		return this.belongsToMany(User).through('Friend');
	},

	// Utility functions
	verifyPassword(password) {
		return pw.verify(this.get('password'), password);
	},

	isPasswordExpired(days = 90) {
		return pw.expired(this.get('password'), days);
	}
});

export default db.model('User', User);
