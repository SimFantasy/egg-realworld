const { Controller } = require('egg')

module.exports = class extends Controller {
	// 获取用户信息
	async getProfile() {
		const { ctx, service } = this
		const { username } = ctx.params
		const loginUser = ctx.user

		const user = await service.user.getUserByName(username)
		if (!user) {
			ctx.errorResponse({ code: 404, message: '用户不存在' })
			return
		}

		if (!loginUser) {
			ctx.body = {
				profile: await user.toProfileJson(false)
			}
		} else {
			const loginUserInfo = await service.user.getUserById(loginUser._id.toString())
			ctx.body = {
				profile: await user.toProfileJson(loginUserInfo)
			}
		}
	}

	// 关注用户
	async follow() {
		const { ctx, service } = this
		const { username } = ctx.params
		const { email } = ctx.user

		const loginUser = await service.user.getUserByEmail(email)

		const user = await service.user.getUserByName(username)
		if (!user) {
			ctx.errorResponse({ code: 404, message: '用户不存在' })
			return
		}

		await loginUser.follow(user._id)

		ctx.body = {
			profile: await user.toProfileJson(loginUser)
		}
	}

	// 取消关注用户
	async unfollow() {
		const { ctx, service } = this
		const { username } = ctx.params
		const { email } = ctx.user

		const loginUser = await service.user.getUserByEmail(email)

		const user = await service.user.getUserByName(username)
		if (!user) {
			ctx.errorResponse({ code: 404, message: '用户不存在' })
			return
		}

		await loginUser.unfollow(user._id)

		ctx.body = {
			profile: await user.toProfileJson(loginUser)
		}
	}
}
