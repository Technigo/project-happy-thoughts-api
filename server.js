import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || `mongodb+srv://spacecake:${process.env.STRING_PW}@cluster0.jgvyhjl.mongodb.net/happyThoughts?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

/* if(process.env.RESET_DB) {
  console.log("Resetting database!")
  const resetDataBase = async () => {
    await Thought.deleteMany();
    thoughtsData.forEach(singleThought => {
      const newGlobe = new Thought(singleThought)
      newGlobe.save();
    }) 
  }
  resetDataBase();
}  */

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const ThoughtSchema = new mongoose.Schema({ // vad var skillnaden på schema och model?
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  const { text/* , like, createdAt */ } = req.body;
  try {
    const newThought = await new Thought({text: text/* , like: like, createdAt: createdAt */}).save();
    res.status(201).json({success: true, response: newThought});
  } catch (error) {
    res.status(400).json({success: false, response: error, message: 'could not save thought to the database' })
  }
});

app.patch("/thoughts/:id/likes", async (req, res) => {
  const { id } = req.params;
  try {
   const thoughtToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {like: 1}});
   if (thoughtToUpdate) {
   res.status(200).json({success: true, response: `Thought ${thoughtToUpdate.text} has been like'ed`});
  } else {
    res.status(404).json({success: false, error: 'Thought not found'})
  }
  } catch (error) {
   res.status(400).json({success: false, error: 'Invalid request' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
