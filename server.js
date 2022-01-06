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
		// unique: true,
	},
	hearts: {
		type: Number,
		default: 0,
	},
	createdAt: {
		type: Number,
		default: Date.now, // can also be written like () => Date.now()
	},
});

const Thought = mongoose.model("Thought", ThoughtSchema);

// Middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Defining routes
app.get("/", (req, res) => {
	res.send(listEndpoints(app)); // Lists all endpoints
});

app.get("/thoughts", async (req, res) => {
	const thoughts = await Thought.find()
		.sort({ createdAt: "desc" })
		.limit(20)
		.exec();
	res.json(thoughts);
});

// v1 - async await
app.post("/thoughts", async (req, res) => {
	const { message } = req.body;

	try {
		const newThought = await new Thought({ message }).save();
		res.status(201).json({ response: newThought, success: true });
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

// v2 - promises
// app.post('/thoughts', (req, res) => {
// 	const { message } = req.body;

// 	new Thought({ message })
// 		.save()
// 		.then((data) => {
// 			res.status(201).json({ response: data, success: true });
// 		})
// 		.catch((error) => {
// 			res.status(400).json({ response: error, success: false });
// 		});
// });

// v3 - mongoose callback
// app.post('/thoughts', (req, res) => {
// 	const { message } = req.body;

// 	new Thought({ message }).save((error, data) => {
// 		if (error) {
// 			res.status(400).json({ response: error, success: false });
// 		} else {
// 			res.status(201).json({ response: data, success: true });
// 		}
// 	});
// });

app.post("/thoughts/:id/hearts", async (req, res) => {
	const { id } = req.params;

	try {
		const updatedThought = await Thought.findByIdAndUpdate(
			id,
			{
				// $inc is a mongo operator that helps us increase a value
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

app.delete("/thoughts/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const deletedThought = await Thought.findOneAndDelete({ _id: id }); // if you don't want to send anything back you can use deleteOne instead of findOneAndDelete and use 204 status for the response
		if (deletedThought) {
			res.status(200).json({ response: deletedThought, success: true });
		} else {
			res.status(404).json({ response: "Thought not found", success: false });
		}
	} catch (error) {
		res.status(400).json({ response: error, success: false });
	}
});

app.patch("/thoughts/:id", async (req, res) => {
	const { id } = req.params;
	const { message } = req.body;

	// v1 - async / await
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

	// v2 - Promises
	// Thought.findOneAndUpdate({ _id: id }, { message }, { new: true })
	// 	.then((updatedThought) => {
	// 		if (updatedThought) {
	// 			res.status(200).json({ response: updatedThought, success: true });
	// 		} else {
	// 			res.status(404).json({ response: 'Thought not found', success: false });
	// 		}
	// 	})
	// 	.catch((error) => {
	// 		res.status(400).json({ response: error, success: false });
	// 	});
});

// Start the server
app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server running on http://localhost:${port}`);
});

// POST request can be used for both creating and updating documents
// PATCH updates entity
// PUT replaces entity
