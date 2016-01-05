exports.up = function(knex, Promise) {
	var user = knex.schema.createTableIfNotExists('user', (table) => {
		table.increments('id');
		table.string('username').notNullable().unique();
		table.string('password').notNullable();
	});

	var friend = knex.schema.createTableIfNotExists('friend', (table) => {
		table.increments('id');
		table.integer('user_id').notNullable().unique().references('id').inTable('user');
		table.integer('friend_id').notNullable().unique().references('id').inTable('user');
	});

	return Promise.all([user, friend]);
};

exports.down = function(knex, Promise) {
	var user = knex.schema.dropTableIfExists('user');
	var friend = knex.schema.dropTableIfExists('friend');

	return Promise.all([user, friend]);
};
