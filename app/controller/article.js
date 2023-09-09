const { Controller } = require('egg')
const slugify = require('slugify')

module.exports = class extends Controller {
	// 获取文章列表
	async getArticles() {
		const { ctx, service } = this
		let offset = 0
		let limit = 10
		let query = {}

		if (ctx.query.offset) {
			offset = ctx.query.offset
		}

		if (ctx.query.limit) {
			limit = ctx.query.limit
		}

		if (ctx.query.tag) {
			query.tagList = { $in: [ctx.query.tag] }
		}

		if (ctx.query.author) {
			const author = await service.user.getUserByName(ctx.query.author)
			if (author) {
				query.author = author._id
			} else {
				ctx.errorResponse({ code: 404, message: '用户不存在' })
			}
		}

		if (ctx.query.favorited) {
			const favoriter = await service.user.getUserByName(ctx.query.favorited)
			if (favoriter) {
				query._id = { $in: favoriter.favoriteArticles }
			} else {
				ctx.errorResponse({ code: 404, message: '用户不存在' })
			}
		}

		const filterArticles = await service.article.getArticles(offset, limit, query)

		const articlesCount = await service.article.getArticlesCount(query)

		if (ctx.user) {
			const loginUser = await service.user.getUserByName(ctx.user.username)
			ctx.body = {
				articles: await Promise.all(
					filterArticles.map(async article => await article.toArticleJson(loginUser, ctx))
				),
				articlesCount
			}
		} else {
			ctx.body = {
				articles: await Promise.all(
					filterArticles.map(article => article.toArticleJson(false, ctx))
				),
				articlesCount
			}
		}
	}

	// 获取关注文章列表
	async getFeedArticles() {
		const { ctx, service } = this
		let offset = 0
		let limit = 10

		if (ctx.query.offset) {
			offset = ctx.query.offset
		}

		if (ctx.query.limit) {
			limit = ctx.query.limit
		}

		const loginUser = await service.user.getUserByName(ctx.user.username)

		const filterArticles = await service.article.getArticles(offset, limit, {
			author: { $in: loginUser.followingUsers }
		})

		const articlesCount = await service.article.getArticlesCount({
			author: { $in: loginUser.followingUsers }
		})

		ctx.body = {
			articles: await Promise.all(
				filterArticles.map(async article => await article.toArticleJson(loginUser, ctx))
			),
			articlesCount
		}
	}

	// 获取文章
	async getArticle() {
		const { ctx, service } = this
		const { slug } = ctx.params

		const article = await service.article.getArticleBySlug(slug)
		if (!article) {
			ctx.errorResponse({ code: 404, message: '文章不存在' })
		}

		if (ctx.user) {
			ctx.body = {
				article: await article.toArticleJson(ctx.user, ctx)
			}
		} else {
			ctx.body = {
				article: await article.toArticleJson(false, ctx)
			}
		}
	}

	// 创建文章
	async createArticle() {
		const { ctx, service } = this

		const articleValidator = await ctx.request.createArticleValidator(ctx.request.body.article)
		if (articleValidator) {
			ctx.errorResponse({ message: articleValidator })
			return
		}

		const { title, description, body, tagList } = ctx.request.body.article

		const author = await service.user.getUserByName(ctx.user.username)

		const article = await service.article.createArticle({ title, description, body })
		article.author = author
		if (Array.isArray(tagList) && tagList.length > 0) {
			article.tagList = tagList
		}

		await article.save()

		ctx.body = {
			article: await article.toArticleJson(author, ctx)
		}
	}

	// 更新文章
	async updateArticle() {
		const { ctx, service } = this
		const { slug } = ctx.params
		const { article } = ctx.request.body

		const articleValidator = await ctx.request.updateArticleValidator(article)
		if (articleValidator) {
			ctx.errorResponse({ message: articleValidator })
			return
		}

		const loginUser = await service.user.getUserByName(ctx.user.username)
		const target = await service.article.getArticleBySlug(slug)

		if (!target) {
			ctx.errorResponse({ message: '文章不存在' })
			return
		}

		if (article.title) {
			target.title = article.title
		}

		if (article.description) {
			target.description = article.description
		}

		if (article.body) {
			target.body = article.body
		}

		if (article.tagList) {
			target.tagList = article.tagList
		}

		await target.save()

		ctx.body = {
			article: await target.toArticleJson(loginUser, ctx)
		}
	}

	// 删除文章
	async removeArticle() {
		const { ctx, service } = this
		const { slug } = ctx.params
		const loginUser = await service.user.getUserByName(ctx.user.username)

		const target = await service.article.getArticleBySlug(slug)
		if (!target) {
			ctx.errorResponse({ message: '文章不存在' })
			return
		}

		if (target.author.toString() !== loginUser._id.toString()) {
			ctx.errorResponse({ message: '没有权限' })
		} else {
			await target.deleteOne({ slug })
			ctx.body = { code: 201, message: '删除成功' }
		}
	}

	// 收藏文章
	async favoriteArticle() {
		const { ctx, service } = this
		const { slug } = ctx.params

		const loginUser = await service.user.getUserByName(ctx.user.username)

		const article = await service.article.getArticleBySlug(slug)
		if (!article) {
			ctx.errorResponse({ message: '文章不存在' })
			return
		}

		await loginUser.favorite(article._id)
		const updateArticle = await article.updateFavoriteCount(ctx)

		ctx.body = {
			article: await updateArticle.toArticleJson(loginUser, ctx)
		}
	}

	// 取消收藏文章
	async unfavoriteArticle() {
		const { ctx, service } = this
		const { slug } = ctx.params

		const loginUser = await service.user.getUserByName(ctx.user.username)

		const article = await service.article.getArticleBySlug(slug)
		if (!article) {
			ctx.errorResponse({ message: '文章不存在' })
		}

		await loginUser.unfavorite(article._id)
		const updateArticle = await article.updateFavoriteCount(ctx)

		ctx.body = {
			article: await updateArticle.toArticleJson(loginUser, ctx)
		}
	}
}
