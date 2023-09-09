const { Service } = require('egg')

module.exports = class extends Service {
	// 获取全部文章
	async getArticles(skip, limit, query) {
		return await this.ctx.model.Article.find(query).skip(skip).limit(limit).sort({ createdAt: -1 })
	}

	// 获取全部文章数量
	async getArticlesCount(query) {
		return await this.ctx.model.Article.countDocuments(query)
	}

	async getArticleBySlug(slug) {
		return await this.ctx.model.Article.findOne({ slug })
	}

	async createArticle(article) {
		return await this.ctx.model.Article.create(article)
	}

	async getTags() {
		return await this.ctx.model.Article.find().distinct('tagList')
	}
}
