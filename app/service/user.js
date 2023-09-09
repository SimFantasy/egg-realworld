const { Service } = require('egg')
const jwt = require('jsonwebtoken')

module.exports = class extends Service {
	async getUserByName(username) {
		return await this.ctx.model.User.findOne({ username })
	}

	async getUserByEmail(email) {
		return await this.ctx.model.User.findOne({ email })
	}

	async getUserById(userId) {
		return await this.ctx.model.User.findById(userId)
	}

	async createUser(user) {
		return await this.ctx.model.User.create(user)
	}

	async jwtVerify(token) {
		return jwt.verify(token, this.app.config.jwt.secret)
	}
}
