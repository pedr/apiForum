
const knex = require('./db.js');

module.exports = class Post {
	constructor({ id, content, userId, threadId }) {
		this.id = id;
		this.content = content;
		this.userId = userId;
		this.threadId = threadId;
	}

	loadInfo(id = this.id) {
		return new Promise((resolve, reject) => {
			knex.select('content', 'user_id as userId', 'thread_id as threadId')
			.from('posts')
			.where('id', id)
			.then(resp => {
				const post = resp[0];
				Object.assign(this, post);
				resolve();
			})
			.catch(e => {
				console.error(e);
				reject();
			})
		})
	}

	save() {
		return new Promise((resolve, reject) => {
			if (!this.content || !this.userId) {
				reject();
			}
			knex.insert(
				{
					content: this.content,
					user_id: this.userId,
					thread_id: this.threadId,
				})
				.into('posts')
				.returning(['id', 'content', 'user_id as userId', 'thread_id as threadId'])
				.then(resp => {
					Object.assign(this, resp);
					resolve();
				})
				.catch(e => {
					console.error(e)
					reject();
				})
		})
	}
}