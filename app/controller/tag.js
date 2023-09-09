const { Controller } = require('egg')

module.exports = class extends Controller {
	// 获取标签列表
	async getTags() {
		const { ctx, service } = this
		const tags = await service.article.getTags()

		ctx.body = {
			tags
		}
	}
}
