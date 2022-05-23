import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//Get all messages
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//Create model for mongo database
const HappyThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlenght: 5,
    maxlenght: 140,
    trim: true, 
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const Thought = mongoose.model("Thought", HappyThoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

//Show thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find({})
      .sort({ createdAt: -1 }).limit(20)
    res.status(200).json({ success: true, response: thoughts });
  } catch (error) {
    res.status(400).json({ success: false, response: error });
  }
});

//Add thoughts
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message: message }).save();
    res.status(201).json({ response: newThought, sucess: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

//Add likes
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params
  try {
    const updatedThought = await Thought.findByIdAndUpdate(thoughtId,{$inc: 
      { hearts: 1, },
      },
      {
        new: true,
      }
    )
    res.status(200).json({ response: updatedThought, success: true })
  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
