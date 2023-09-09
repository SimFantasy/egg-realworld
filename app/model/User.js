module.exports = app => {
	const { mongoose, ctx, model } = app
	const { Schema } = mongoose

	const userSchema = new Schema(
		{
			username: {
				type: String,
				required: true,
				unique: true,
				lowercase: true,
				trim: true
			},
			email: {
				type: String,
				required: true,
				unique: true,
				index: true,
				lowercase: true,
				trim: true
			},
			password: {
				type: String,
				required: true
			},
			bio: {
				type: String,
				default: ''
			},
			image: {
				type: String,
				default: '/images/default_avatar.jpg'
			},
			favoriteArticles: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Article'
				}
			],
			followingUsers: [
				{
					type: Schema.Types.ObjectId,
					ref: 'User'
				}
			]
		},
		{
			timestamps: true
		}
	)

	userSchema.methods.generateToken = function (ctx) {
		return ctx.jwtSign({
			id: this._id,
			username: this.username,
			email: this.email
		})
	}

	userSchema.methods.toUserJson = function (ctx) {
		return {
			username: this.username,
			email: this.email,
			bio: this.bio,
			image: this.image,
			token: this.generateToken(ctx)
		}
	}

	userSchema.methods.toProfileJson = function (user) {
		return {
			username: this.username,
			bio: this.bio,
			image: this.image,
			following: user ? user.isFollowing(this._id) : false
		}
	}

	userSchema.methods.isFollowing = function (userId) {
		return this.followingUsers.some(id => id.toString() === userId.toString())
	}

	userSchema.methods.follow = function (userId) {
		const result = this.followingUsers.some(id => id.toString() === userId.toString())
		if (!result) {
			this.followingUsers.push(userId)
		}
		return this.save()
	}

	userSchema.methods.unfollow = function (userId) {
		const result = this.followingUsers.some(id => id.toString() === userId.toString())
		if (result) {
			this.followingUsers.remove(userId)
		}
		return this.save()
	}

	userSchema.methods.isFavorite = function (id) {
		for (const article of this.favoriteArticles) {
			if (article.toString() === id.toString()) {
				return true
			}
		}
		return false
	}

	userSchema.methods.favorite = function (articleId) {
		const result = this.favoriteArticles.some(id => id.toString() === articleId.toString())
		if (!result) {
			this.favoriteArticles.push(articleId)
		}
		return this.save()
	}

	userSchema.methods.unfavorite = function (articleId) {
		const result = this.favoriteArticles.some(id => id.toString() === articleId.toString())
		if (result) {
			this.favoriteArticles.remove(articleId)
		}
		return this.save()
	}

	return mongoose.model('User', userSchema)
}
