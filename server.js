import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

// Mongoose & Database setup:
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Validation and error checking
// TODO: Check if mongodb is up



// Mongoose model setup:
const Thought = mongoose.model("Thought", {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  // strict? not assignable
  heart: {
    type: Number,
    default: 0,
    // required: true,
  },
  // strict? not assignable
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


// Seed database?

/*


*/


// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());
// Middleware for handling if "no connection to Mongodb":
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable " });
  }
});

// Start defining your routes here
/* app.get('/', (req, res) => {
  res.send('Hello super world')
}) */

// GET the Thoughts:
app.get("/", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

// TODO: create app.post '/', to send thought:

// POST the Thoughts:

app.post("/", async (req, res) => {
  // retrieve message sent by client to our API endpoint:
  const { message } = req.body;
  // use our mongoose model to create the database entry:
  const thought = new Thought({ message });
  try {
    // success
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res
      .status(400)
      .json({
        message: "Could not save thought to Database",
        error: err.errors,
      });
  }
});

// TODO: create app.post '/' for heart/like on thought:

// TODO:
// Validation of user input when POSTing a thought
// Handling error's
// Sending back error codes: 400..

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
