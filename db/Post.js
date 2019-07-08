
const knex = require('./db.js');
const User = require('./User.js');

module.exports = class Post {
	constructor({ id, content, userId, threadId, user, thread }) {
		this.id = id;
		this.content = content;
		this.userId = userId;
		this.user = user;
		this.threadId = threadId;
		this.thread = thread;
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

	getUser() {
		return new Promise((resolve, reject) => {
			knex.select('id', 'nickname', 'post_count as postCount')
				.from('users')
				.where('id', this.userId)
				.then(resp => {
					const user = resp[0];
					this.user = user;
					resolve();
				})
				.catch(e => {
					console.error(e);
					reject();
				})
				
		})
	}

	async save() {
		try {
			if (!this.content || !this.userId) {
				throw "Content and userId are necessary";
			}

			const createPost = knex.insert(
				{
					content: this.content,
					user_id: this.userId,
					thread_id: this.threadId,
				})
				.into('posts')
				.returning(['id', 'content', 'user_id as userId', 'thread_id as threadId'])
				.catch(e => {
					console.error(e)
				});
			
			const resp = await createPost[0];
			console.log(resp);
			Object.assign(this, resp);

			const user = new User({id: this.userId}).increasePostCount();
		} catch (e) {
			console.error(e);
		}
		return null;
	}
}