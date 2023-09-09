module.exports = app => {
	const { mongoose, ctx, model } = app
	const { Schema } = mongoose
	const { User } = model

	const commentSchema = new Schema(
		{
			body: {
				type: String,
				required: true
			},
			author: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			},
			article: {
				type: Schema.Types.ObjectId,
				ref: 'Article'
			}
		},
		{
			timestamps: true
		}
	)

	commentSchema.methods.toCommentJson = async function (user, ctx) {
		const author = await ctx.model.User.findById(this.author)

		return {
			id: this._id,
			body: this.body,
			author: await author.toProfileJson(user),
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		}
	}

	return mongoose.model('Comment', commentSchema)
}
