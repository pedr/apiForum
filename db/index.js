
const knex = require('./db.js');
const User = require('./User.js');
const Post = require('./Post.js');
const Thread = require('./Thread.js');

module.exports = {
	knex,
	User,
	Post,
	Thread,
};