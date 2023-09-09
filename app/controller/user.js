const { Controller } = require('egg')

class UserController extends Controller {
	// 注册
	async create() {
		const { ctx, service } = this
		const { user } = ctx.request.body

		// 验证参数
		const userValidator = await ctx.request.registerValidator(user)
		if (userValidator) {
			this.ctx.errorResponse({ message: userValidator })
			return
		}

		// 验证用户名是否已存在
		const username = await service.user.getUserByName(user.username)
		if (username) {
			ctx.errorResponse({ message: '用户名已存在' })
			return
		}

		// 验证邮箱是否已存在
		const email = await service.user.getUserByEmail(user.email)
		if (email) {
			ctx.errorResponse({ message: '邮箱已存在' })
			return
		}
		// md5加密密码
		user.password = await ctx.helper.handleMd5(user.password)

		// // 创建用户
		const newUser = await service.user.createUser(user)

		// 返回用户信息
		ctx.body = {
			user: await newUser.toUserJson(ctx)
		}
	}

	// 登录
	async login() {
		const { ctx, service } = this
		const { user } = ctx.request.body

		// 验证参数
		const userValidator = await ctx.request.loginValidator(user)
		if (userValidator) {
			this.ctx.errorResponse({ message: userValidator })
			return
		}

		// 验证邮箱是否存在
		const result = await service.user.getUserByEmail(user.email)
		if (!result) {
			ctx.errorResponse({ message: '邮箱不存在' })
			return
		}

		// 验证密码是否正确
		const password = await ctx.helper.handleMd5(user.password)
		if (result.password !== password) {
			ctx.errorResponse({ message: '密码错误' })
			return
		}

		// 返回用户信息
		ctx.body = {
			user: await result.toUserJson(ctx)
		}
	}

	// 获取当前用户
	async getCurrentUser() {
		const { ctx, service } = this
		const user = ctx.user

		// 获取用户信息
		const result = await service.user.getUserById(user.id)
		if (!result) {
			ctx.errorResponse({ message: '用户不存在' })
			return
		}

		ctx.body = {
			user: await result.toUserJson(ctx)
		}
	}

	// 更新当前用户
	async updateCurrentUser() {
		const { ctx, service } = this
		const { user } = ctx.request.body
		const { email } = ctx.user

		// 验证参数
		const userValidator = await ctx.request.updateUserValidator(user)
		if (userValidator) {
			ctx.errorResponse({ message: userValidator })
			return
		}

		// 获取用户信息
		const target = await service.user.getUserByEmail(email)

		if (!target) {
			ctx.errorResponse({ message: '用户不存在' })
			return
		}

		if (user.username) {
			target.username = user.username
		}

		if (user.email) {
			target.email = user.email
		}

		if (user.password) {
			target.password = await ctx.helper.handleMd5(user.password)
		}

		if (typeof user.bio !== 'undefined') {
			target.bio = user.bio
		}

		if (typeof user.image !== 'undefined') {
			target.image = user.image
		}

		await target.save()

		// 返回用户信息
		ctx.body = {
			user: await target.toUserJson(ctx)
		}
	}
}

module.exports = UserController
