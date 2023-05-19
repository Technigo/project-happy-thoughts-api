import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Thought schema and model
const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    default: 'undefined',
    enum: [
      'undefined', 'weather', 'mood', 'professional', 'personal', 'achievement', 'funny', 'family', 'weekend', 'other'
    ]
  }
});

const Thought = mongoose.model('Thought', thoughtSchema);

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Return 20 latest thoughts
app.get("/thoughts", async (req, res) => {
  const thoughtsList = await Thought.find().sort({createdAt: 'desc'}).limit(20);
  try {
    res.status(200).json(thoughtsList);
  } catch (e) {
    res.status(400).json({ 
      success: false,
      message: 'Could not get thoughts',
      error: e
    });
  }; 
});

// Add new post
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const newThought = new Thought({ message });
  
  try {
    const savedThought = await newThought.save();
    res.status(201).json(savedThought);
  } catch (e) {
    res.status(400).json({
      success: false,
      message: 'Bad request. Could not save thought',
      error: e });
  };
});


// Post request for updating like-count
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  //id from url :param
  const { thoughtId } = req.params;
  // if id is found increases hearts count by one
  try {
    const liked = await Thought.findByIdAndUpdate(thoughtId,{ $inc: { hearts: 1 } });
    res.status(200).json(liked);
  } catch (e) {
    res.status(400).json({
      success: false,
      message: 'Could not like thought',
      error: e});
  };
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
