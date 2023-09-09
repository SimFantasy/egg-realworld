const Joi = require('joi')

module.exports = {
	async registerValidator(params) {
		const rule = {
			username: Joi.string().min(3).max(24).required().messages({
				'string.min': '用户名长度不能小于3位',
				'string.max': '用户名长度不能大于24位',
				'any.required': '用户名不能为空'
			}),
			email: Joi.string().email().required().messages({
				'string.email': '邮箱格式不正确',
				'any.required': '邮箱不能为空'
			}),
			password: Joi.string().min(6).max(24).required().messages({
				'string.min': '密码长度不能小于6位',
				'string.max': '密码长度不能大于24位',
				'any.required': '密码不能为空'
			})
		}

		return await this.ctx.handleValidator(params, rule)
	},

	async loginValidator(params) {
		const rule = {
			email: Joi.string().email().required().messages({
				'string.email': '邮箱格式不正确',
				'any.required': '邮箱不能为空'
			}),
			password: Joi.string().min(6).max(24).required().messages({
				'string.min': '密码长度不能小于6位',
				'string.max': '密码长度不能大于24位',
				'any.required': '密码不能为空'
			})
		}

		return await this.ctx.handleValidator(params, rule)
	},

	async updateUserValidator(params) {
		const rule = {
			username: Joi.string().min(3).max(24).messages({
				'string.min': '用户名长度不能小于3位',
				'string.max': '用户名长度不能大于24位'
			}),
			email: Joi.string().email().messages({
				'string.email': '邮箱格式不正确'
			}),
			password: Joi.string().min(6).max(24).messages({
				'string.min': '密码长度不能小于6位',
				'string.max': '密码长度不能大于24位'
			}),
			bio: Joi.string().max(140).messages({
				'string.max': '简介不能大于140个字符'
			}),
			image: Joi.string().messages({
				string: '图片格式不正确'
			})
		}

		return await this.ctx.handleValidator(params, rule)
	},

	async createArticleValidator(params) {
		const rule = {
			title: Joi.string().required().max(40).messages({
				'string.max': '标题不能大于40个字符',
				'any.required': '标题不能为空'
			}),
			description: Joi.string().required().max(240).messages({
				'string.max': '描述不能大于200个字符',
				'any.required': '描述不能为空'
			}),
			body: Joi.string().required().max(16000).messages({
				'string.max': '内容不能大于16000个字符',
				'any.required': '内容不能为空'
			}),
			tagList: Joi.array().items(Joi.string()).messages({
				'array.items': '标签格式不正确'
			})
		}

		return await this.ctx.handleValidator(params, rule)
	},

	async updateArticleValidator(params) {
		const rule = {
			title: Joi.string().max(40).messages({
				'string.max': '标题不能大于40个字符'
			}),
			description: Joi.string().max(240).messages({
				'string.max': '描述不能大于200个字符'
			}),
			body: Joi.string().max(16000).messages({
				'string.max': '内容不能大于16000个字符'
			}),
			tagList: Joi.array().items(Joi.string()).messages({
				'array.items': '标签格式不正确'
			})
		}

		return await this.ctx.handleValidator(params, rule)
	}
}
