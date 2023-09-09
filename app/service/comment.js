const { Service } = require('egg')

module.exports = class extends Service {
	async getCommentById(commentId) {
		return await this.ctx.model.Comment.findById(commentId)
	}

	async createComment(comment) {
		return await this.ctx.model.Comment.create(comment)
	}
}
