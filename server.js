import express from 'express';
import bodyParser, { json } from 'body-parser';
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

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Middleware to handle server connection errors
app.use((req, res, next) => {
	try {
		if (mongoose.connection.readyState === 1) {
			next();
		} else {
			res.status(503).json({ error: 'Service unavailable' });
		}
	} catch (error) {
		res.status(400).json({ error: 'Error! Could not access the server.' });
	}
});

//Mongoose model
const Thought = new mongoose.model('Thought', {
	message: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 140,
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

// Start defining your routes here

app.get('/thoughts', async (req, res) => {
	try {
		const thoughts = await Thought.find()
			.sort({ createdAt: 'desc' })
			.limit(20)
			.exec();

		res.json(thoughts);
	} catch (err) {
		res.status(400).json({
			success: false,
			message: 'Could not get thoughts',
			errors: err.errors,
		});
	}
});

//Post a new thought

app.post('/thoughts', async (req, res) => {
	const { message } = req.body;
	const newThought = await new Thought({ message });
	try {
		const savedThought = await newThought.save();
		res.status(201).json(savedThought);
	} catch (err) {
		res.status(400).json({
			success: false,
			message: 'Could not save new thought to the database',
			errors: err.errors,
		});
	}
});

//Like a post

app.post('/thoughts/:thoughtId/like', async (req, res) => {
	try {
		await Thought.updateOne(
			{ _id: req.params.thoughtId },
			{ $inc: { hearts: 1 } }
		);
		res.status(200).json();
	} catch (err) {
		res
			.status(400)
			.json({
				message: 'Could not find and like this post',
				errors: err.errors,
			});
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
