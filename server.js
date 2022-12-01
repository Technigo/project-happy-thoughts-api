import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

/* const Post = mongoose.model('Post', {
	text: {
		type: String,
		required: true,
		minlength: 5,
	},
	complete: {
		type: Boolean,
		default: false,
	},
	createAt: {
		type: Date,
		default: Date.now,
	},
}); */

const PostsSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true, //set to true will be saved to the database
		unique: false, // new text will need to be different if set to true
		// enum:[] //all the allowed values, has to be one of the values that are in the array.
	},
	complete: {
		type: Boolean,
		default: false,
	},
	description: {
		type: String,
		minlength: 4,
		maxlength: 30,
	},
	score: {
		type: Number,
		default: 0,
	},
	createAt: {
		type: Date,
		default: () => new Date(),
	},
});

const Posts = mongoose.model('Posts', PostsSchema);
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
	res.send('hello world');
});

app.get('/posts', async (req, res) => {
	const { page, perPage } = req.query;
	try {
		const posts = await Posts.find()
			.sort({ createAt: 'desc' })
			.skip((page - 1) * perPage)
			.limit(perPage); // not skipping anything
		res.status(200).json({ success: true, response: posts });
	} catch (err) {
		res.status(400).json({ success: false, response: err.errors });
	}
});

app.post('/posts', async (req, res) => {
	//retrieve info sent by the client to API end point, then use mongoose model to create the database entree
	const { text, complete } = req.body;
	const post = new Posts({ text, complete });
	try {
		const savedPost = await post.save(); // post is the new Post model, calling it on the new model
		res.status(201).json({ success: true, response: savedPost });
	} catch (err) {
		res.status(400).json({
			success: false,
			message: 'Could not save post to the database',
			response: err.errors,
		});
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
