import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Post = mongoose.model('Post', {
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
});
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
	const posts = await Post.find().sort({ createAt: 'desc' }).limit(20).exec();
	res.status(200).json(posts);
});

app.post('/posts', async (req, res) => {
	//retrieve info sent by the client to API end point, then use mongoose model to create the database entree
	const { text, complete } = req.body;
	const post = new Post({ text, complete });
	try {
		const savedPost = await post.save(); // post is the new Post model, calling it on the new model
		res.status(201).json(savedPost);
	} catch (err) {
		res.status(400).json({
			message: 'Could not save post to the database',
			error: err.errors,
		});
	}
});
// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
