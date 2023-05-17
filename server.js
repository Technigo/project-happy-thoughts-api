import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

//Listing the endpoints in the API.
const listEndpoints = require('express-list-endpoints');


// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "ALL OK",
    body: {
      cotent: "Happy Thoughts API",
      enpoints: listEndpoints(app)
    }
  });
});

/////// Tuesday ///////

const { Schema } = mongoose;
const happyThoughtSchema = new Schema({
 message: {
  type: String,
  required: true,
  minlength: 4,
  maxlength: 140
 },
 heart: {
  type: Number,
  default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
});

const happyThought = mongoose.model('happyThought', happyThoughtSchema);


app.get("/thoughts", async (req, res) => {
  const thoughts = await happyThought.find().sort({ createdAt: "desc" }).limit(20).exec();
  res.status(200).json(thoughts);
});

app.get("/thoughts/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleThought = await Thought.findById(id)
    if (singleThought) {
      res.status(200).json(singleThought);
    } else {
      res.status(400).json('Not found');
    }
    } catch (err) {
      res.status(400).json('No such id found in here');
    }
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const thought = await new happyThought({ message }).save();
    res.status(201).json({
      success: true,
      response: thought,
      message: "Thought created successfully"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Error occurred while posting"
    });
  }
});


//Patching:
app.patch("/thoughts/id/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const thought = await Thought.findByIdAndUpdate(id, { $inc: { heart: 1 } }, { new: true });
    res.status(201).json({
      success: true,
      response: thought,
      message: "Liked successfully"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Error occured while liking"
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

