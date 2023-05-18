import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// The schema defines the structure and rules for the data that will be stored in the MongoDB collection
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 5, 
    maxlength: 140,
    required: true,
  },
  hearts: {
    type: Number, 
    default: 0
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

// The model for ThoughtSchema, created using mongoose.model(), is a wrapper around the schema that provides an interface 
// for querying and manipulating the MongoDB collection. 
// The model allows you to perform CRUD (Create, Read, Update, Delete) operations on the "Thoughts" collection

const Thought = mongoose.model('Thought', ThoughtSchema);

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Defines endpoint paths as constants to be able to only update the paths in one place if needed
const PATHS = {
  root: "/",
  thoughts: "/thoughts",
  thoughtsById: "/thoughts/:id/like"
}

// Start defining your routes here
// When a client sends an HTTP GET request to the root URL, 
// the callback function (req, res) => {...} is executed

// listEndpoints(app): This function is imported from the 
// "express-list-endpoints" library. It takes the app object, 
// which represents the Express application, as an argument. 
// It inspects the application and returns an array of all the 
// defined endpoints in the application, including their 
// HTTP methods, paths, and middleware.

// res.json(listEndpoints(app)) sends the list of endpoints in JSON format 
// as the response to the client when a GET request is made to the root URL ("/"). 

// GET
app.get(PATHS.root, (req, res) => {
  res.send(listEndpoints(app));
});

// Retrieves the 20 most recent thoughts from the MongoDB database, 
// sorting them in descending order by their creation dates, 
// and assigns the result to the thoughts variable.

// The ternary operator 'thoughts ? res.json(thoughts) : res.status(404).json({ error: "thoughts not found" })' 
// is used to check if the thoughts variable is truthy. 
// If thoughts is truthy (not null, undefined, 0, empty string, etc.), it executes res.json(thoughts), 
// which sends the thoughts as a JSON response. 
// Otherwise, if thoughts is falsy, it executes res.status(404).json({ error: "thoughts not found" }), 
// which sends a JSON response with a 404 status code and an error message.

// GET
app.get(PATHS.thoughts, async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  thoughts ? res.json(thoughts) : res.status(400).json({ error: 'Posts not found'});
});

// POST
// User input (thought) is validated and saved in database if the validation checks out
app.post(PATHS.thoughts, async (req, res) => {
  console.log(Thought)
  // Retrieve the information sent by the client to our API endpoint
  const {message} = req.body;

    try {
  const newThought = await new Thought({
    message: message
  }).save()
  console.log(newThought)

  res.status(200).json({
    success: true,
    response: `Your thought was posted: ${newThought}`
  })
} catch (err) {
    res.status(400).json({
      success: false,
      response:'Thought could not be posted', 
      error: err.errors
    });
  }
});


// POST 
// Increase hearts by 1 if the thought is liked using the $inc operator. The 'hearts' is from the ThoughtSchema.
app.post(PATHS.thoughtsById, async (req, res) => {
  const { id } = req.params;
  try {
    const updateHearts = await Thought.findByIdAndUpdate (id, { $inc: { hearts: 1 } });
    res.status(200).json({
      success: true,
      response: `The post ${updateHearts.id} has been updated with a heart`
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      response: 'Hearts not updated',
      error: err.errors
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
