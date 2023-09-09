module.exports = app => {
	const { mongoose, model } = app
	const { Schema } = mongoose

	const tagSchema = new Schema({
		tagName: {
			type: String,
			required: true,
			unique: true
		},
		articles: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Article'
			}
		]
	})

	return mongoose.model('Tag', tagSchema)
}
