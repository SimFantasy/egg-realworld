const path = require('node:path/posix')

exports.keys = 'sim@realworld_egg'

exports.md5Salt = 'sim@realworld_egg_md5_salt'

exports.jwt = {
	secret: 'sim@realworld_egg_jwt',
	expiresIn: '7d'
}

exports.mongoose = {
	url: 'mongodb://127.0.0.1:27017/egg_realworld',
	options: {},
	plugins: []
}

exports.security = {
	csrf: {
		enable: false
	}
}

exports.cors = {
	origin: '*',
	allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
}

exports.static = {
	prefix: '/'
}

exports.logger = {
	level: 'INFO',
	// consoleLevel: 'DEBUG',
	dir: path.join(__dirname, '../logs')
}
