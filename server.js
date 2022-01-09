import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/happyThoughts';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

//Schema for a more clean and dynamic approach
const ThoughtSchema = new mongoose.Schema({
	message: {
		type: String,
		minlength: 5,
		maxlength: 140,
		trim: true,
		required: true,
	},
	categories: {
		type: String,
		enum: [
			'Food thought',
			'Project thought',
			'Meditation thought',
			'Travel thought',
			'Other thought',
		],
		required: true,
	},
	hearts: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Number,
		default: () => Date.now(),
	},
	author: {
		type: String,
		default: 'Anonymous',
	},
});

const Thought = mongoose.model('Thought', ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//----ENDPOINTS------
// Start defining your routes here
app.get('/', (req, res) => {
	res.send(
		'Hello world, Welcome to Madelene Happy Thoughts API  - see this API live at 👉:https://mt-dotse-happy-thoughts.netlify.app/'
	);
});

//Endpoint showing all the possible enpoints in the app
app.get('/endpoints', (req, res) => {
	res.send(listEndpoints(app));
});

//Endpoint to get the most recent 20 thoughts
app.get('/thoughts', async (req, res) => {
	try {
		const allThoughts = await Thought.find()
			.sort({ createdAt: 'desc' })
			//.skip(5) to skip the first two objects
			.limit(20);
		res.status(200).json(allThoughts);
	} catch (error) {
		res.status(404).json({
			message: 'Can not find thoughts',
			errors: error.errors,
			success: false,
		});
	}
});

//Endpoint to post messages, categories, author
// async/await form
app.post('/thoughts', async (req, res) => {
	const { message, categories, author } = req.body;
	try {
		const newThought = await new Thought({
			message,
			author,
			categories: categories || 'neutral',
		}).save();
		//status (201) indicates success, more specific than (200)
		res.status(201).json({ response: newThought, success: true });
	} catch (error) {
		res.status(400).json({
			message: 'Can not save the thought',
			error: error.error,
			success: false,
		});
	}
});

// promise form
// app.post('/thoughts', (req, res) => {
// 	const { message} = req.body;

// 	new Thought({ message })
// 		.save()
// 		.then((data) => {
// 			res.status(201).json({ response: data, success: true });
// 		})
// 		.catch((error) => {
// 			res.status(400).json({ response: error, success: false });
// 		});
// });

// mongoose form
// app.post('/thought', (req, res) => {
// 	const { message  } = req.body;

// 	new Thought({ message}).save((error, data) => {
// 		if (error) {
// 			res.status(400).json({ response: error, success: false });
// 		} else {
// 			res.status(201).json({ response: data, success: true });
// 		}
// 	});
// });

//Enpoint to increase the hearts/likes
app.post('/thoughts/:thoughtId/like', async (req, res) => {
	const { thoughtId } = req.params;
	try {
		const updatedHeart = await Thought.findByIdAndUpdate(
			thoughtId,
			{
				$inc: {
					hearts: 1,
				},
			},
			{
				new: true,
			}
		);
		if (updatedHeart) {
			res.status(201).json({ response: updatedHeart, success: true });
		} else {
			res.status(404).json({ message: 'Not found!', success: false });
		}
	} catch (error) {
		res.status(400).json({
			message: 'Can not update the heart/like',
			errors: error.error,
			success: false,
		});
	}
});

//Endpoint to delete a thought
app.delete('/thoughts/:id/', async (req, res) => {
	const { id } = req.params;

	try {
		const deletedThoughts = await Thought.findOneAndDelete({ _id: id }); //findOneAndDelete()
		//status 204 means no content and should be used in combination with deleteOne
		//status 200 should go with findOneAndDeleteOne

		if (deletedThoughts) {
			res.status(200).json({ response: deletedThoughts, success: true });
		} else {
			res
				.status(404)
				.json({ response: 'Can not find the thought', success: false });
		}
	} catch (error) {
		res.status(400).json({
			message: 'Can not delete the thought',
			errors: error.error,
			success: false,
		});
	}
});

// Start the server
app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server running on http://localhost:${port}`);
});
