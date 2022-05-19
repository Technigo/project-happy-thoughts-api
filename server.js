import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl =
	process.env.MONGO_URL || 'mongodb://localhost/project-mongo-wk19';
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

const thought = mongoose.model('thought', ThoughtsSchema);

//Start of routes
app.get('/', (req, res) => {
	const Main = {
		About: 'API Happy Thoughts project.',
		Frontend: 'https://marianneshappy-thoughts.netlify.app/',
	};
	res.send(Main);
});

//Gets thoughts
app.get('/thoughts', async (req, res) => {
	try {
		const thoughts = await thought
			.find()
			.sort({ createdAt: 'desc' })
			.limit(20)
			.exec();
		res.status(200).json(thoughts);
	} catch (error) {
		res.status(400).json({
			success: false,
			response: error,
		});
	}
});

//POST new thought
app.post('/thoughts', async (req, res) => {
	const { message } = req.body;

	try {
		const newThought = await new thought({ message }).save();
		res.status(200).json({
			response: newThought,
			success: true,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			response: error,
		});
	}
});

//Updates number of likes on heart
app.post('/thoughts/:thoughtId/like', async (req, res) => {
	const { thoughtId } = req.params;

	try {
		const thoughtToLike = await thought.findByIdAndUpdate(thoughtId, {
			$inc: { hearts: 1 },
		});
		res.status(200).json({
			response: thoughtToLike,
			success: true,
		});
	} catch (error) {
		res.status(400).json({
			message: 'Could not find post',
			success: false,
			response: error,
		});
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
