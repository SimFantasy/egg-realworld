const routes = {}

const rootPrefix = '/api'

routes.userRoutes = app => {
	const { router, middleware } = app
	const { verifyAuth } = middleware

	router.post(`${rootPrefix}/users`, 'user.create')
	router.post(`${rootPrefix}/users/login`, 'user.login')
	router.get(`${rootPrefix}/user`, verifyAuth(app), 'user.getCurrentUser')
	router.put(`${rootPrefix}/user`, verifyAuth(app), 'user.updateCurrentUser')
}

routes.profileRoutes = app => {
	const { router, middleware } = app
	const { verifyAuth } = middleware
	const prefix = `${rootPrefix}/profiles`

	router.get(`${prefix}/:username`, verifyAuth(false, app), 'profile.getProfile')
	router.post(`${prefix}/:username/follow`, verifyAuth(app), 'profile.follow')
	router.delete(`${prefix}/:username/follow`, verifyAuth(app), 'profile.unfollow')
}

routes.articleRoutes = app => {
	const { router, middleware } = app
	const { verifyAuth } = middleware
	const prefix = `${rootPrefix}/articles`

	router.get(`${prefix}`, verifyAuth(false, app), 'article.getArticles')
	router.get(`${prefix}/feed`, verifyAuth(app), 'article.getFeedArticles')
	router.get(`${prefix}/:slug`, verifyAuth(false, app), 'article.getArticle')
	router.post(`${prefix}`, verifyAuth(app), 'article.createArticle')
	router.put(`${prefix}/:slug`, verifyAuth(app), 'article.updateArticle')
	router.delete(`${prefix}/:slug`, verifyAuth(app), 'article.removeArticle')
	router.post(`${prefix}/:slug/favorite`, verifyAuth(app), 'article.favoriteArticle')
	router.delete(`${prefix}/:slug/favorite`, verifyAuth(app), 'article.unfavoriteArticle')
}

routes.commentRoutes = app => {
	const { router, middleware } = app
	const { verifyAuth } = middleware
	const prefix = `${rootPrefix}/articles`

	router.get(`${prefix}/:slug/comments`, verifyAuth(false, app), 'comment.getComments')
	router.post(`${prefix}/:slug/comments`, verifyAuth(app), 'comment.createComment')
	router.delete(`${prefix}/:slug/comments/:commentId`, verifyAuth(app), 'comment.removeComment')
}

routes.tagRoutes = app => {
	const { router } = app
	const prefix = `${rootPrefix}/tags`

	router.get(`${prefix}`, 'tag.getTags')
}

module.exports = app => {
	Object.values(routes).forEach(route => route(app))
}
