
exports.up = function(knex) {
	return knex.schema
		.createTable('threads', function (table) {
			table.increments('id');
			table.integer('author_id').unsigned();
            table.boolean('is_visible').defaultTo(true);
            table.text('content');
            table.foreign('author_id').references('users.id');
			table.timestamps(false, true);
        })
        .alterTable('posts', function (table) {
            table.integer('thread_id').unsigned();
            table.foreign('thread_id').references('threads.id');
        })
};

exports.down = function(knex) {
    return knex.schema
        .alterTable('posts', function (table) {
            table.dropColumn('thread_id');
        })
        .dropTable('threads');
};
