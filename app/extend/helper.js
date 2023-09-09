const crypto = require('crypto')

module.exports = {
	// 加密
	handleMd5(str) {
		return crypto
			.createHash('md5')
			.update(str + this.config.md5Salt)
			.digest('hex')
	}
}
