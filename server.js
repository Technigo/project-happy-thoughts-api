import express from "express";
import cors from "cors";
import mongoose, { now } from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// created schema to make code more reusable
const ThoughtSchema = new mongoose.Schema({
	messages: {
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
		default: () => Date.now(),
	},
});

const Thought = mongoose.model("Thought", ThoughtSchema);

// Defines the port the app will run on.
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
	res.send({
		"Welcome happy thoughts api - by Linnéa. Full documentation on GitHub 👉  https://github.com/Skrosen/project-happy-thoughts-api/blob/master/Documentation.md":
			listEndpoints(app),
	});
});

// enpoint showing the latest 20 posts sorted in descending order
app.get("/thoughts", async (req, res) => {
	const thoughts = await Thought.find()
		.sort({ createdAt: "desc" })
		.limit(20)
		.exec();
	try {
		res.status(200).json({ response: thoughts, success: true });
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

//for adding new posts or thoughts to the database
app.post("/thoughts", async (req, res) => {
	const { messages } = req.body;
	const thought = await new Thought({ messages });
	try {
		const savedThought = await thought.save();
		res.status(201).json({ response: savedThought, success: true });
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

//using mongo operator to increase, $inc.  new is used to give back the latest count
app.post("/thoughts/:messageId/like", async (req, res) => {
	const { messageId } = req.params;
	try {
		const updatedLike = await Thought.findByIdAndUpdate(
			messageId,
			{ $inc: { hearts: 1 } },
			{ new: true }
		);
		res.status(200).json({ response: updatedLike, success: true });
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

// Start the server
app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server running on http://localhost:${port}`);
});
