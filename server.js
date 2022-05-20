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

const ThoughtSchema = new mongoose.Schema({
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
});

const Thought = mongoose.model('Thought', ThoughtSchema);

// List all endpoints
app.get('/', (req, res) => {
	res.send(listEndpoints(app));
});

// Get 20 most recent thoughts
app.get('/thoughts', async (req, res) => {
	try {
		const Thoughts = await Thought.find({})
			.sort({ createdAt: 'desc' })
			.limit(20)
			.exec();
		res.status(200).json(Thoughts);
	} catch (error) {
		res.status(400).json({
			success: false,
			error: 'Bad Request',
		});
	}
});

// POST new thought
app.post('/thoughts', async (req, res) => {
	const { message } = req.body;

	try {
		const newThought = await new Thought({ message: message }).save();
		res.status(201).json({ response: newThought, success: true });
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

// POST likes on thought id
app.post('/thoughts/:thoughtId/like', async (req, res) => {
	const { thoughtId } = req.params;
	try {
		const likeUpdate = await Thought.findByIdAndUpdate(thoughtId, {
			$inc: { hearts: 1 },
		});
		res.status(201).json({
			response: likeUpdate.message,
			success: true,
		});
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
