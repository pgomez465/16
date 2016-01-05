import db		from '../database';
import 			'./user';

const Friend = db.Model.extend({
	user() {
		return this.belongsTo('User');
	},

	friend() {
		return this.belongsTo('User');
	}
});

export default db.model('Friend', Friend);
