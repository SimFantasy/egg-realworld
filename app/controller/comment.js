const { Controller } = require('egg')

module.exports = class extends Controller {
	// 获取文章评论
	async getComments() {
		const { ctx, service } = this
		const { slug } = ctx.params

		const article = await service.article.getArticleBySlug(slug)
		if (!article) {
			ctx.errorResponse({ code: 404, message: '文章不存在' })
			return
		}

		if (ctx.user) {
			const loginUser = await service.user.getUserById(ctx.user.id)

			ctx.body = {
				comments: await Promise.all(
					article.comments.map(async commentId => {
						const commentObj = await service.comment.getCommentById(commentId)
						return await commentObj.toCommentJson(loginUser, ctx)
					})
				)
			}
		} else {
			ctx.body = {
				comments: await Promise.all(
					article.comments.map(async commentId => {
						const comment = await service.comment.getCommentById(commentId)
						return await comment.toCommentJson(false, ctx)
					})
				)
			}
		}
	}

	// 添加评论
	async createComment() {
		const { ctx, service } = this
		const { slug } = ctx.params
		const { comment } = ctx.request.body

		const commenter = await service.user.getUserById(ctx.user.id)
		if (!commenter) {
			ctx.errorResponse({ code: 400, message: '请先登录' })
			return
		}

		const article = await service.article.getArticleBySlug(slug)
		if (!article) {
			ctx.errorResponse({ code: 404, message: '文章不存在' })
			return
		}

		const newComment = await service.comment.createComment({
			body: comment.body,
			article: article._id,
			author: commenter._id
		})

		await article.addComment(newComment._id)

		ctx.body = {
			comment: await newComment.toCommentJson(commenter, ctx)
		}
	}

	// 删除评论
	async removeComment() {
		const { ctx, service } = this
		const { slug, commentId } = ctx.params

		const commenter = await service.user.getUserById(ctx.user.id)
		if (!commenter) {
			ctx.errorResponse({ code: 400, message: '请先登录' })
			return
		}

		const article = await service.article.getArticleBySlug(slug)
		if (!article) {
			ctx.errorResponse({ code: 404, message: '文章不存在' })
			return
		}

		const comment = await service.comment.getCommentById(commentId)
		if (!comment) {
			ctx.errorResponse({ code: 404, message: '评论不存在' })
			return
		}

		if (comment.author.toString() !== commenter._id.toString()) {
			ctx.errorResponse({ code: 403, message: '没有权限' })
			return
		}

		await article.removeComment(commentId)

		ctx.body = {
			code: 200,
			message: '删除成功'
		}
	}
}
