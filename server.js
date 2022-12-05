import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

dotenv.config()

// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
const mongoUrl = process.env.MONGO_URL || `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.eilze2r.mongodb.net/project-happy-thoughts-api?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8020;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


const ThoughtsSchema = new mongoose.Schema({
	//in this object specify every single thing about this property
	message: {
		type: String,
		minlength: 5,
		maxlength: 140,
		required: true,
		// trim removes unneccessary white spaces from the begining and from the end of our whole message
		// by default is false and we here change it to true
		trim: true
	},
	// score will only have 2 properties
	hearts: {
		type: Number,
		//initil value if none other is specified
		default: 0
	},
	//createdAt should have Date
	createdAt: {
		type: Date,
		// new Date() will execute once - when we start the server
		default: () => new Date()
	}
});

const Thoughts = mongoose.model("Thoughts", ThoughtsSchema);

// Start defining your routes here
app.get("/", (req, res) => {
	res.send({ Message: "Hello, Welcome to our Happy Thoughts!", data: listEndpoints(app), endpoints: 
	{'GET': '/thoughts  get the 20 latest thoughs',
	'POST' : '/thougths post new message',
	'PATCH' : '/thougths/:thoughtId/like to like a posted message'
 } });
});


app.get("/thoughts", async (req, res) => {
	try {
		const thoughts = await Thoughts.find().sort({ createdAt: 'desc' }).limit(20).exec();
		res.status(200).json(thoughts);
	} catch (error) {
		res.status(400).json({
			success: false,
			response: "Bad request, not able to fetch thoughts.",
		});
	}
});

// Create a Post handler and using Restful route that should be Post to thoughts
//V1/the most universal one is with async await

app.post("/thoughts", async (req, res) => {
	//Retrieve the information sent by the client to our API endpoint. Send information to the request
	const { message } = req.body;
	console.log(req.body);
	try {
		// Use our mongoose model to create the database entry/create a new thought to Mongo and will send it to the Database
		const newThoughts = await new Thoughts({ message }).save();
		//Success
		res.status(201).json({ success: true, response: newThoughts });
	} catch (err) {
		//Bad Request
		res.status(400).json({ success: false, response: "Could not save thought to the Database", error: err.errors })
	}
});

app.patch("/thoughts/:thoughtId/like", async (req, res) => {
	const { thoughtId } = req.params;
	try {
		const thoughtToUpdateLike = await Thoughts.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } });
		res.status(200).json({ success: true, response: `Thoughts ${thoughtToUpdateLike} has their heart updated` });
	} catch (error) {
		res.status(400).json({ success: false, response: "Could not show the likes for this ID" });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
