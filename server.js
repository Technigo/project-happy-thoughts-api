import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl =
	process.env.MONGO_URL || 'mongodb://localhost/project-project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtsSchema = new mongoose.Schema({
	message: {
		type: String,
		required: true, //for your msg to show up in the json body
		// enum:[] //all the allowed values, has to be one of the values that are in the array.
		minlength: 4,
		maxlength: 30,
		trim: true,
	},
	hearts: {
		type: Number,
		default: 0,
	},
	createAt: {
		type: Date,
		default: () => new Date(),
	},
});

const Thoughts = mongoose.model('Thoughts', ThoughtsSchema);
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
	res.send({
		Message: 'This API is dedicated to Technigo Project Happy Thoughts',
		Routes: [
			{
				'/thoughts': 'Request the latest 20 posts',
				'/thoughts/:id/like': 'Storing how many times like has been updated',
			},
		],
	});
});

app.get('/thoughts', async (req, res) => {
	try {
		const showThoughts = await Thoughts.find()
			.sort({ createAt: 'desc' })
			.limit(20)
			.exec();
		res.status(200).json(showThoughts);
	} catch (err) {
		res.status(400).json({
			success: false,
			message: 'Bad request - try again',
			response: err.errors,
		});
	}
});

app.post('/thoughts', async (req, res) => {
	//retrieve info sent by the client to API end point, then use mongoose model to create the database entree
	const { message, createAt } = req.body;
	const thought = new Thoughts({ message, createAt });
	try {
		const savedThought = await thought.save(); // post is the new Post model, calling it on the new model
		res.status(201).json({ success: true, response: savedThought });
	} catch (err) {
		res.status(400).json({
			success: false,
			message: 'Could not save your thoughts to the database',
			response: err.errors,
		});
	}
});

app.patch('/thoughts/:id/like', async (req, res) => {
	const { id } = req.params;
	try {
		const likeUpdate = await Thoughts.findByIdAndUpdate(id, {
			$inc: { hearts: 1 },
		});
		res.status(200).json({
			success: true,
			response: `Thought ${likeUpdate.id} has the total likes updated`,
		});
	} catch (err) {
		res.status(400).json({
			success: false,
			message: 'Could not update the request',
			response: err.errors,
		});
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
