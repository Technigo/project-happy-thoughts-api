import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thought = mongoose.model('Thought', {
  text: {
    type: String,
    minlength: 5
  }, 
  createdAt: {
    type: Date,
    default: () => new Date()
  }, 
  hearts: {
    type: Number,
    default: 0
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.json({
    ResponseMessage: "Welcome to Jessika's Happy Thoughts-API. With the use of this API, you can post happy thoughts (POST), view happy thoughts (GET) and like happy thoughts (PATCH)",
    routes: {
      "GET: /thoughts": "displays the 20 (if there are 20) most recent happy thoughts in the database",
      "POST: /thoughts": "post a happy thought (text) to the database in JSON-format",
      "PATCH: /thoughts/:id/hearts": "like a happy thought"
    }
  });
});

//Get-request
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts)
})

//Post-request
app.post("/thoughts", async (req, res) => {
  const {text} = req.body
  const thought = new Thought({text})

  try {
    const savedThought = await thought.save()
    res.status(201).json({sucess: true, response: savedThought})
  } catch (err) {
    res.status(400).json({sucess: false, message: 'Could not save thought to the database', error: err.errors})
  }
})

// PATCH-request
app.patch("/thoughts/:id/hearts", async (req, res) => {
  const { id } = req.params
  const thoughtToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}})

  try {
    res.status(200).json({success: true, response: `Thought ${thoughtToUpdate.id} has their hearts updated`})
  } catch (err) {
    res.status(400).json({success: false, message: 'Could not save thought to the database', error: err.errors})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
