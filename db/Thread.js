
const knex = require('./db.js');
const Post = require('./Post.js');

module.exports = class Thread {
	constructor({ id, authorId, content, isVisible = true, posts = [] }) {
		this.id = id;
		this.authorId = authorId;
		this.isVisible = isVisible;
		this.content = content;
		this.posts = posts;
	}

	loadInfo(id = this.id) {
		return new Promise((resolve, reject) => {
			knex.select('author_id as authorId', 'is_visible as isVisible', 'content')
				.from('threads')
				.where('id', id)
				.then(resp => {
					const thread = resp[0];
					Object.assign(this, thread);
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
			if (!this.authorId) {
				reject();
			}
			knex.insert(
				{
					author_id: this.authorId,
					content: this.content,
				})
				.into('threads')
				.returning(['id', 'author_id as authorId', 'is_visible as isVisible', 'content'])
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

	getPosts() {
		return new Promise((resolve, reject) => {
			if (!this.id) {
				reject();
			}
			knex.select('id', 'thread_id as threadId', 'content', 'user_id as userId')
				.from('posts')
				.where('thread_id', this.id)
				.then(resp => {
					this.posts = resp.map(post => new Post(post));
					resolve();
				})
				.catch(e => {
					console.error(e);
					reject();
				})
		})
	}
}