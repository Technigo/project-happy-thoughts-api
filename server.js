import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//set this option to false in order to use findOneAndUpdate()
mongoose.set("useFindAndModify", false);
//Model for the database object
const Thought = mongoose.model("Thought", {
	message: {
		type: String,
		maxlength: 140,
		minlength: 5,
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

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
	res.send("Hello world");
});

//Create new thought
app.post("/thoughts", async (req, res) => {
	try {
		const thought = new Thought({ message: req.body.message });
		await thought.save();
		res.status(200).json(thought);
	} catch (err) {
		res
			.status(400)
			.json({ message: "Could not save thought.", errors: err.errors });
	}
});

//Like a thought
app.post("/thoughts/:thoughtid", async (req, res) => {
	try {
		const thoughtId = req.params.thoughtid;
		const thought = await Thought.findOneAndUpdate(
			{ _id: thoughtId },
			{ $inc: { hearts: 1 } }
		);
		res.status(200).json(thought);
	} catch (err) {
		res
			.status(400)
			.json({ message: "Could not like thought.", errors: err.errors });
	}
});

//get 20 happythoughts
app.get("/thoughts", async (req, res) => {
	try {
		const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
		res.status(200).json(thoughts);
	} catch (err) {
		res
			.status(400)
			.json({ message: "Could not like thought.", errors: err.errors });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
