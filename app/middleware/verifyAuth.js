module.exports = (required = true, app) => {
	return async function verifyAuth(ctx, next) {
		const { authorization = '' } = ctx.headers

		if (!authorization) {
			if (required) {
				ctx.errorResponse({ code: 401, message: '请先登录' })
			} else {
				await next()
			}
		} else {
			try {
				const token = authorization.replace('Bearer ', '')
				const user = await ctx.jwtVerify(token)
				ctx.user = await ctx.model.User.findById(user.id.toString())
				await next()
			} catch (error) {
				ctx.errorResponse({ code: 401, message: error || '无效 Token' })
				return
			}
		}
	}
}
