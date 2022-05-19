import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const HappyThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 140
  },
  like: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const HappyThought = mongoose.model("HappyThought", HappyThoughtSchema);

app.get("/", (req, res) => {
  res.send("Hello and welcome to Happy thoughts!");
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await HappyThought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts);
});

app.post('/thoughts', async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = new HappyThought({message: message});
      await newThought.save();
      res.status(201).json({
        response: newThought,
        success: true
      });
    } catch(err) {
      res.status(400).json({
        response: err,
        message: 'Could not save the thought', 
        errors: err.errors,
        success: false,
        status: 400
      })
    }
});

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params;
  try {
    const happyThoughtToUpdate = await HappyThought.findByIdAndUpdate(id, { $inc: {like: 1}})
    console.log(happyThoughtToUpdate.message);
    res.status(200).json({response: `Happy Thought "${happyThoughtToUpdate.message}" is liked`, success: true});
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
