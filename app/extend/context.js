const jwt = require('jsonwebtoken')
const Joi = require('joi')

module.exports = {
	// 生成token
	jwtSign(payload) {
		return jwt.sign(payload, this.app.config.jwt.secret, {
			expiresIn: this.app.config.jwt.expiresIn
		})
	},
	// 验证token
	jwtVerify(token) {
		return jwt.verify(token, this.app.config.jwt.secret)
	},
	// 返回错误消息
	errorResponse({ code = 400, message = 'Bad Request' }) {
		this.body = { code, message }
	},
	// 验证参数
	async handleValidator(params, rule) {
		const validatorSchema = Joi.object(rule)
		try {
			await validatorSchema.validateAsync(params, { abortEarly: false })
		} catch (error) {
			return (
				error.details.map(e => {
					const errorMsg = {}
					errorMsg[e.context.key] = e.message
					return errorMsg
				}) ?? '参数错误'
			)
		}
	}
}
