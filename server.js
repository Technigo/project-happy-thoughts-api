import cors from 'cors'
import express, { response } from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import { validationResult, body } from 'express-validator'
import expressListEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

//Schema
const Schema = new mongoose.Schema({
	message: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 140,
	},
	hearts: {
		type: Number,
		default: 0,
		immutable: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		immutable: true,
	},
})

//Model
const Thought = mongoose.model('Thought', Schema)

// Start defining your routes here
app.get('/', (req, res) => {
	const endpoints = expressListEndpoints(app)
	if (endpoints) {
		res.status(200).json(endpoints)
	} else {
		res.status(500).json({ error: 'Failed to load endpoints' })
	}
})

//get route that gets the 20 latest messages
app.get('/thoughts', async (req, res) => {
	const thoughts = await Thought.find()
		.sort({ createdAt: 'desc' })
		.limit(20)
		.exec()

	if (thoughts.length === 20 || thoughts.length < 20) {
		res.status(201).json({
			success: true,
			response: thoughts,
			message: 'Showing the 20 latest entries',
		})
	} else {
		res.status(400).json({
			success: false,
			response: error,
			message: 'Could not load messages',
		})
	}
})

//get route to find thought by id
app.get('/thoughts/:id', async (req, res) => {
	const { id } = req.params
	console.log({ id })
	try {
		const thoughtId = await Thought.findById(id)
		res.status(200).json({
			success: true,
			response: thoughtId,
			message: 'Thought found by Id',
		})
	} catch (error) {
		console.error('error finding by id', error)
		res.status(400).json({
			success: false,
			response: error,
			message: 'Could not find thought with this id',
		})
	}
})

//post route for posting new Thought
app.post('/thoughts', async (req, res) => {
	const { message, createdAt } = req.body
	try {
		const newThought = new Thought({ message, createdAt })
		const postedThought = await newThought.save()
		res.status(201).json({
			success: true,
			response: postedThought,
			message: 'New thought created',
		})
	} catch (error) {
		console.error('what is the post error?', error)
		res.status(400).json({
			success: false,
			response: error.toString(),
			message: 'Thought couldnt be created',
		})
	}
})

//post route to update likes for posts
app.post('/thoughts/:id/like', async (req, res) => {
	try {
		const updateLikesById = req.params.id
		const updatedLikeCount = await Thought.findByIdAndUpdate(
			updateLikesById,
			{ $inc: { hearts: 1 } },
			{ new: true }
		)
		res.status(201).json({
			success: true,
			response: updatedLikeCount,
			message: 'Likes updated with one heart',
		})
	} catch (error) {
		res.status(400).json({
			success: false,
			response: error,
			message: 'Could not update likes',
		})
	}
})

//patch route 
app.patch('/thoughts/:id', async (req, res) => {
	const { id } = req.params

	const { message, hearts, createdAt } = req.body

	try {
		const updateThought = await Thought.findByIdAndUpdate(
			id,
			{ message: message },
			{ new: true, runValidators: true }
		)

		res.status(200).json({
			success: true,
			reponse: updateThought,
			message: 'message updated'
		})
	} catch (error) {
		res.status(400).json({
			success: false,
			reponse: 'Error',
			message: 'could not update hearts',
		})
	}
})

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
