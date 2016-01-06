var credential = require('credential');
var pw = credential();

exports.seed = function(knex, Promise) {
	return Promise.all([
    	// Deletes ALL existing entries
    	knex('users').del(),
		knex('friends').del(),

    	// Inserts seed entries
    	pw.hash('password')
		.then((hash) => {
			return knex('users').insert({
				id: 1,
				username: 'nulifier',
				password: hash
			});
		}),
    	pw.hash('bunny')
		.then((hash) => {
			return knex('users').insert({
				id: 2,
				username: 'mel',
				password: hash
			});
		}),

		knex('friends').insert({
			id: 1,
			user_id: 1,
			friend_id: 2
		}),
		knex('friends').insert({
			id: 2,
			user_id: 2,
			friend_id: 1
		})
	]);
};
