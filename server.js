import cors from 'cors'
import express, { response } from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import { validationResult, body } from 'express-validator'
import expressListEndpoints from 'express-list-endpoints'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()
// const bodyParser = require('body-parser')

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

//create Schema
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

// create model
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

//get endpoint that gets the 20 latest messages
app.get('/Thoughts', async (req, res) => {
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

//find thought by id
app.get('/Thoughts/:id', async (req, res) => {
	const { id } = req.params
  console.log({id})
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

//post endpoints
app.post('/Thoughts', async (req, res) => {
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

//patch endpoint (samma namn som post), ändra något specifikt i det som postats
app.patch('/Thoughts/:id', async (req, res) => {
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
			message: 'message updated',
			// `hearts updated to ${hearts}`
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
