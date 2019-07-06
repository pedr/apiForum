
exports.up = function(knex) {
	return knex.schema
		.createTable('users', function (table) {
			table.increments('id');
			table.string('nickname', 32).notNullable().unique();
			table.string('password').notNullable();
			table.integer('post_count').unsigned().defaultTo(0);
			table.timestamps(false, true);
		})
		.createTable('posts', function (table) {
			table.increments('id');
			table.text('content');
			table.integer('user_id').unsigned();
			table.foreign('user_id').references('users.id')
			table.timestamps(false, true);
		})
};

exports.down = function(knex) {
	return knex.schema
		.dropTable('posts')
		.dropTable('users');
};
