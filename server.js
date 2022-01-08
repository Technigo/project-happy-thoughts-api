import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const ThoughtSchema = new mongoose.Schema({
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

const Thought = mongoose.model("Thought", ThoughtSchema);

// Middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

/************************** GET **************************/

app.get("/", (req, res) => {
	res.send(listEndpoints(app));
});

app.get("/thoughts", async (req, res) => {
	const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20);
	res.status(200).json({ response: thoughts, success: true });
});

/************************** POST **************************/

app.post("/thoughts", async (req, res) => {
	const { message } = req.body;

	try {
		const newThought = await new Thought({ message }).save();
		res.status(201).json({ response: newThought, success: true });
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

app.post("/thoughts/:id/like", async (req, res) => {
	const { id } = req.params;

	try {
		const updatedThought = await Thought.findByIdAndUpdate(
			id,
			{
				$inc: {
					hearts: 1,
				},
			},
			{
				new: true,
			}
		);
		res.status(200).json({ response: updatedThought, success: true });
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

/************************** DELETE **************************/

app.delete("/thoughts/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const deletedThought = await Thought.findOneAndDelete({ _id: id });
		if (deletedThought) {
			res.status(200).json({ response: deletedThought, success: true });
		} else {
			res.status(404).json({ response: "Thought not found", success: false });
		}
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

/************************** PATCH **************************/

app.patch("/thoughts/:id", async (req, res) => {
	const { id } = req.params;
	const { message } = req.body;

	try {
		const updatedThought = await Thought.findOneAndUpdate(
			{ _id: id },
			{ message },
			{ new: true }
		);
		if (updatedThought) {
			res.status(200).json({ response: updatedThought, success: true });
		} else {
			res.status(404).json({ response: "Thought not found", success: false });
		}
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

// Start the server
app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server running on http://localhost:${port}`);
});
