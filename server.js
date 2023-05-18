import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength:5,
    maxlength:140
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hearts: {
    type: Number,
    default: 0
  }
})

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Welcome to Frida's happy vibes API!");
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts); 
  })

app.post('/thoughts', async (req, res) => {
const {message} = req.body;

const thought = new Thought({message})

try{
  const savedThought = await thought.save();
  res.status(201).json(savedThought)
}catch (e) {
  res.status(400).json({message: 'Could not save thought to the database', error: e.errors})
}
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params

  try{
    const heartsUpdated = await Thought.findByIdAndUpdate(
    thoughtId,
    {$inc: {hearts: 1}},
    {new:true}
    );
    res.status(200).json({
    success: true,
    response: `Thought ${heartsUpdated._id} has been updated with a heart`
    });
  } catch (e) {
    res.status(400).json({
    success: false,
    response: "Thought-Id not found"
  });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
