import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import allEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

const ThoughtSchema = new mongoose.Schema({
  message: {
    // the most important property is type
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    // trim deletes whitespace from beginning and end of a string
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: ()=> new Date()
  }
});

const Thought = mongoose.model("Thought", ThoughtSchema)

///// Routes starting here
app.get("/", (req, res) => {
  res.send(
    {
      "Hello!": "Welcome to Camillas Happy Thoughts API",
      "Find the available endpoints here": "/endpoints",
      "Updated Happy Thoughts Project can be found here": "https://the-happy-thoughts-project.netlify.app"
    }
  );
});

app.get("/endpoints", (req, res) => {
  res.send(allEndpoints(app))
})

///// GETTING the thoughts in the database
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec()
    res.status(200).json(thoughts)
  
  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request. Unable to get thoughts.",
      error: error.errors
    })
  }
});

///// POSTING a new thought to the database
app.post("/thoughts", async (req, res) => {

  const { message } = req.body;

  try {
    const newThought = await new Thought({message}).save()
    res.status(201).json({
      response: newThought,
      success: true
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request. Unable to save this thought.",
      error: error.errors
    })
  }
});

///// FINDING and UPDATING (liking) a thought 
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thoughtToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}})
    res.status(201).json({
      response: `Thought ${thoughtToUpdate.message} has been liked!`,
      success: true
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request. Unable to find and update this thought.",
      error: error.errors
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
