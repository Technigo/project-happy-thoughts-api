import cors from 'cors'
import express, { response } from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import { validationResult, body } from 'express-validator'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()
const bodyParser = require('body-parser')

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
	res.send('Hello Technigo!')
})

//post endpoints OBS EJ KLAR! EJ ENL MITT PROJEKT
app.post('/Thoughts', async (req, res) => {
	const { message, hearts, createdAt } = req.body
	try {
		const postThought = await new Thought({ message, hearts, createdAt }).save()
		res.status(201).json({
			success: true,
			response: Thought,
			message: 'New thought created',
		})
	} catch (error) {
		res.status(400).json({
			success: false,
			response: error,
			message: 'Thought couldnt be created',
		})
	}
})

//patch endpoint (samma namn som post), ändra något specifikt i det som postats
app.patch('/Thoughts/:id', async (req, res) => {
	const { id } = req.params

	const { message, hearts, createdAt } = req.body

	//kanske det ska vara här jag uppdaterar likes? googla.
	try {
		const updateThought = await Thought.findByIdAndUpdate(
			id,
			{ message: newMessage },
			{ new: true, runValidators: true }
		)

		res.status(200).json({
			success: true,
			reponse: Thought,
			message: 'hearts updated',
			// `hearts updated to ${hearts}`
		})
	} catch (error) {
		res.status(400).json({
			success: false,
			reponse: error,
			message: 'could not update hearts',
		})
	}
})

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`)
})
