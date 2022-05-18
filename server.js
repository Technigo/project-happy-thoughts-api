import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import allEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8081
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// app.use((req, res, next) => {
// 	if (mongoose.connection.readyState === 1) {
// 		next()
// 	} else {
// 		res.status(503).json({ error: 'Service unavailable', success: false })
// 	}
// })

app.use((req, res, next) => {
	if (mongoose.connection.readyState === 1) {
		next()
	} else {
		res.status(503).json({ error: 'Service unavailable' })
	}
})

const HappyThoughtSchema = new mongoose.Schema({
	message: {
		type: String,
		required: true,
		unique: true,
		minlength: [5, 'The message must be at least 5 characters'],
		maxlength: [140, 'The message must be less than 140 characters'],
		trim: true,
	},
	likes: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: () => new Date(),
	},
})

const HappyThought = mongoose.model('HappyThought', HappyThoughtSchema)

// Start defining your routes here
app.get('/', (req, res) => {
	res.send(allEndpoints(app))
})

app.get('/thoughts', async (req, res) => {
	try {
		const Thoughts = await HappyThought.find({}).sort({ createdAt: 'desc' }).limit(10).exec()

		res.status(200).json(Thoughts)
	} catch (error) {
		res.status(400).json({
			success: false,
			error: 'no such thought',
		})
	}
})

app.post('/thoughts', async (req, res) => {
	const { message, likes } = req.body
	console.log(req.body)
	try {
		const newThought = await new HappyThought({ message: message, likes: likes }).save()
		res.status(201).json({ response: newThought, success: true })
	} catch (error) {
		res.status(400).json({ response: error, success: false })
	}
})

//POST -> creates, PUT -> replace, PATCH -> update
app.post('/thoughts/:thoughtId/like', async (req, res) => {
	const { id } = req.params
	try {
		const thoughtToUpdate = await HappyThought.findByIdAndUpdate(id, { $inc: { likes: 1 } })
		res.status(201).json({ response: `${thoughtToUpdate.message} has one more like`, success: true })
	} catch (error) {
		res.status(400).json({ response: error, success: false })
	}
})

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
