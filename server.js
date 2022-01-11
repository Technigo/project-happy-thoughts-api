import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//Schema

const thoughtsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: [
      5,
      "Please get more Wordy. More Words. More Love. Nuff said innit.",
    ],
    maxlength: [140, "Alrighty, thats enough words from you, Chatterbox"],
    trim: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    // can also be written as () => Date.now(), as an anonymous call-back function
    required: true,
  },

  hearts: {
    type: Number,
    default: 0,
  },

  name: {
    type: String,
    minlength: 3,
    default: "Anonymous",
  },
});

//model using the thoughtsSchema

const Thought = mongoose.model("Thought", thoughtsSchema);

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(
    "Hi Lovely People, this is Karas Happy Thoughts API. Get Happy People"
  );
});

// endpoint for users to fetch the most recent 20 thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const allThoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20) // this sets the max message count at 20
      .exec();
    res.json(allThoughts);
  } catch (err) {
    res.status(404).json({
      message: "Can not retrieve thoughts!",
      error: err.errors,
      success: false,
    });
  }
});

//endpoint for the user to POST a thought
app.post("/thoughts", async (req, res) => {
  //Retrieve the information sent by the client to our API endpoint from the request body
  const { message, name } = req.body;

  //Use our mongoose model to create the database entry
  try {
    // success
    const savedThought = await new Thought({
      message,
      name: name || "Anonymous",
    }).save();
    res.status(201).json({
      response: savedThought,
      success: true,
    }); // 201 status code means something has been successfully created
  } catch (err) {
    res.status(400).json({
      message: "Could not save thought to the database",
      error: err.errors,
      success: false,
    });
  }
});

// add POST endpoint to like/add hearts
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const likedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (likedThought) {
      res.status(201).json({
        response: likedThought,
        success: true,
      });
    } else {
      res.status(404).json({
        message: "Not found!",
        success: false,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Could not add that like to the database",
      error: err.errors,
      success: false,
    });
  }
});

// add patch endpoint to UPDATE a thought

app.patch("/thoughts/:thoughtId", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      req.body,
      { new: true }
    );
    if (updatedThought) {
      res.json({response: updatedThought, success: true});
    } else {
      res.status(404).json({
        message: "Could not find message",
        success: false,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "invalid request",
      error: err.errors,
      success: false,
    });
  }
});

// add delete endpoint to delete a post
app.delete("/thoughts/:thoughtId", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const deletedThought = await Thought.findByIdAndDelete(thoughtId);
    if (deletedThought) {
      res.json({response: deletedThought, success: true});
    } else {
      res.status(404).json({ message: "Could not find message", success: false, });
    }
  } catch (err) {
    res.status(400).json({ message: "invalid request", error: err.errors, success: false, });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
