
const knex = require('./db.js');

module.exports = class User {
	constructor({ id, nickname, password, postCount }) {
		this.id = id;
		this.nickname = nickname;
		this.password = password;
		this.postCount = postCount;
	}

	loadInfo(id = this.id) {
		return new Promise((resolve, reject) => {
			knex.select('nickname', 'post_count as postCount')
			.from('users')
			.where('id', id)
			.then(resp => {
				const user = resp[0];
				Object.assign(this, user);
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
			if (!this.nickaname || !this.password) {
				reject();
			}
			knex.insert(
				{
					nickname: this.nickname,
					password: this.password,
				})
				.into('users')
				.returning(['id', 'nickname', 'post_count as postCount'])
				.then(resp => {
					Object.assign(this, user);
					resolve();
				})
				.catch(e => {
					console.error(e)
					reject();
				})
		})
	}

	async increasePostCount() {
		try {
			await this.loadInfo();
			const updatePostCount = knex('users')
				.returning('post_count as postCount')
				.where('id', this.id)
				.increment('post_count', 1)
				.catch(e => console.error(e));
		} catch (e) {
			console.error(e);
		}
		return null;
	}
}