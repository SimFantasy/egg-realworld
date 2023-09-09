const slugify = require('slugify')

module.exports = app => {
	const { mongoose } = app
	const { Schema } = mongoose

	const articleSchema = new Schema(
		{
			slug: {
				type: String,
				required: true,
				unique: true,
				index: true
			},
			title: {
				type: String,
				required: true
			},
			description: {
				type: String,
				required: true
			},
			body: {
				type: String,
				required: true
			},
			tagList: [{ type: String }],
			author: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			},
			favoriteCount: {
				type: Number,
				default: 0
			},
			comments: [
				{
					type: Schema.Types.ObjectId,
					ref: 'Comment'
				}
			]
		},
		{
			timestamps: true
		}
	)

	articleSchema.pre('validate', function (next) {
		this.slug = slugify(this.title, { lower: true, replacement: '-' })
		next()
	})

	articleSchema.methods.updateFavoriteCount = async function (ctx) {
		const count = await ctx.model.User.countDocuments({
			favoriteArticles: { $in: [this._id] }
		})
		this.favoriteCount = count

		return this.save()
	}

	articleSchema.methods.toArticleJson = async function (user, ctx) {
		const author = await ctx.model.User.findById(this.author)
		return {
			slug: this.slug,
			title: this.title,
			description: this.description,
			body: this.body,
			tagList: this.tagList,
			author: await author.toProfileJson(user),
			favorited: user ? user.isFavorite(this._id) : false,
			favoritesCount: this.favoriteCount,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		}
	}

	articleSchema.methods.addComment = async function (commentId) {
		if (!this.comments.some(comment => comment.toString() === commentId.toString())) {
			this.comments.push(commentId)
		}
		return this.save()
	}

	articleSchema.methods.removeComment = async function (commentId) {
		if (this.comments.some(comment => comment.toString() === commentId.toString())) {
			this.comments.remove(commentId)
		}
		return this.save()
	}

	return mongoose.model('Article', articleSchema)
}
