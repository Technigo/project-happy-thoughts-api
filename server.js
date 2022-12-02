import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || `mongodb+srv://spacecake:${process.env.STRING_PW}@cluster0.jgvyhjl.mongodb.net/happyThoughts?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0 
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

const Thought = mongoose.model("Thought", ThoughtSchema);

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get('/thoughts', async (req, res) => {
  try {
  const thoughtList = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.status(200).json(thoughtList);
} catch (error) {
  res.status(400).json({success: false, response: error})
}
});



app.post("/thoughts", async (req, res) => {
  const { name, message } = req.body;
  try {
    const newThought = await new Thought({name: name, message: message}).save();
    res.status(201).json({success: true, response: newThought});
  } catch (error) {
    res.status(400).json({success: false, response: error, message: 'could not save thought to the database' })
  }
});

app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
   const thoughtToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
    if (thoughtToUpdate) {
   res.status(200).json({success: true, response: `Thought ${thoughtToUpdate.thoughtId} has been like'ed`});
  } else {
    res.status(404).json({success: false, error: 'Thought not found'})
  }
  } catch (error) {
   res.status(400).json({success: false, error: 'Invalid request' });
  }
});

app.delete("/thoughts/:thoughtId", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const deletedThought = await Thought.findOneAndDelete({_id: thoughtId});
    if (deletedThought) {
      res.status(200).json({success: true, response: deletedThought});
    } else {
      res.status(404).json({success: false, response: 'Thought not found'});
    }
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
