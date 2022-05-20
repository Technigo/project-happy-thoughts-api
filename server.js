import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import allEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-happy-thpughts-api-kolkri'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
	if (mongoose.connection.readyState === 1) {
		next()
	} else {
		res.status(503).json({ error: 'Service unavailable', success: false })
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
	hearts: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: () => new Date(),
	},
})

const HappyThought = mongoose.model('HappyThought', HappyThoughtSchema)

// Starting endpoint to list different endpoints
app.get('/', (req, res) => {
	res.send(allEndpoints(app))
})

//This endpoint should return a maximum of 20 thoughts, 
//sorted by createdAt to show the most recent thoughts first.

app.get('/thoughts', async (req, res) => {
	try {
		const Thoughts = await HappyThought.find({}).sort({ createdAt: 'desc' }).limit(20).exec()

		res.status(200).json(Thoughts)
	} catch (error) {
		res.status(400).json({
			success: false,
			error: 'no such thought',
		})
	}
})

app.post('/thoughts', async (req, res) => {
	const { message } = req.body

	try {
		const newThought = await new HappyThought({ message: message }).save()
		res.status(201).json({ response: newThought, success: true })
	} catch (error) {
		res.status(400).json({ response: error, success: false })
	}
})

//This endpoint doesn't require a JSON body. Given a valid thought id in the URL, 
//the API should find that thought, and update its hearts property to add one heart.

app.post('/thoughts/:thoughtId/like', async (req, res) => {
	const { thoughtId } = req.params

	try {
		const thoughtToUpdate = await HappyThought.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } })
		res.status(201).json({ response: `${thoughtToUpdate.message} has one more like`, success: true })
	} catch (error) {
		res.status(400).json({ response: error, success: false })
	}
})

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})