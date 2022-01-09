import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Mongoose schema of the thought
const ThoughtSchema = mongoose.Schema({
	message: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 140,
		trim: true,
	},
	hearts: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Mongoose model which includes the thought schema
const Thought = mongoose.model('Thought', ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
	res.send(
		'Welcome to Beckys Happy Thought API! To see it live go to: https://britishswede-happy-thoughts.netlify.app/'
	);
});

// Endpoint to return 20 thoughts
app.get('/thoughts', async (req, res) => {
	try {
		const thoughtsList = await Thought.find({})
			.sort({ createdAt: 'desc' })
			.limit(20);

		res.status(200).json(thoughtsList);
	} catch (error) {
		// If above code is unsuccessful, status code = bad request:
		res.status(400).json({ response: error, success: false });
	}
});

// Endpoint to post new thought
app.post('/thoughts', async (req, res) => {
	const { message } = req.body;

	try {
		const newThought = await new Thought({ message }).save();

		//If successful, status code = successful:
		res.status(201).json({ response: newThought, success: true });
	} catch (error) {
		// If above code is unsuccessful, status code = bad request:
		res.status(400).json({ response: error, success: false });
	}
});

// Endpoint to like message
app.post('/thoughts/:thoughtId/like', async (req, res) => {
	const { thoughtId } = req.params;

	try {
		const addLike = await Thought.findByIdAndUpdate(
			// ID of the message to be liked/updated. MANDATORY parameter, what ID the object has!
			thoughtId,
			// Increases hearts by 1. MANDATORY parameter, how to update the object!
			{
				$inc: { hearts: 1 },
			},
			// Returns the modified document instead of the original. OPTIONAL parameter!
			{ new: true }
		);
		res.status(201).json({ response: addLike, success: true });
	} catch (error) {
		// If above code is unsuccessful, this happens:
		res.status(400).json({ response: error, success: false });
	}
});

// Start the server
app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server running on http://localhost:${port}`);
});
