
const knex = require('./db.js');
const Post = require('./Post.js');
const User = require('./User.js');

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

	async getPosts() {
		const promisePosts = 
			knex.select('id', 'thread_id as threadId', 'content', 'user_id as userId')
					.from('posts')
					.where('thread_id', this.id)
					.orderBy('created_at')
					.then(resp => resp.map(post => new Post(post)))
					.catch(e => {
						console.error(e);
						return null;
					});
		try {
			if (!this.id) {
				throw "Invalid id";
			}
			const posts = await promisePosts;
			const postsGetUser = posts.map(post => post.getUser());
			await Promise.all(postsGetUser);
			this.posts = posts;
		} catch (e) {
			console.error(e);
		}
		return null;
	}
}