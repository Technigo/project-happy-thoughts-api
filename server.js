import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const ThoughtsSchema = new mongoose.Schema({
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

const thought = mongoose.model('thought', ThoughtsSchema);

// Start defining your routes here
app.get('/', (req, res) => {
	res.send(listEndpoints(app));
});

// Get 20 most recent thoughts
app.get('/thoughts', async (req, res) => {
	try {
		const thoughts = await thought
			.find()
			.sort({ createdAt: 'desc' })
			.limit(20)
			.exec();
		res.status(200).json(thoughts);
	} catch (err) {
		res.status(400).json({
			sucess: false,
			error: err.errors,
		});
	}
});

// POST new thought
app.post('/thoughts', async (req, res) => {
	try {
		const newThought = await new ThoughtsSchema(req.body).save();
		res.status(200).json(newThought);
	} catch (err) {
		res.status(400).json({
			message: 'Error',
			errors: err.errors,
		});
	}
});

// POST likes on thought id
app.post('/thoughts/:thoughtId/like', async (req, res) => {
	try {
		await Thought.updateLike(
			{ _id: req.params.thoughtId },
			{ $inc: { hearts: 1 } }
		);
		res.status(200).json();
	} catch (err) {
		res.status(400).json({
			message: 'Error! Unable to like this thought: thought not found.',
			errors: err.errors,
		});
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
