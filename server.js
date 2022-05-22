import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8090;
const app = express();

app.use(cors());
app.use(express.json());


const HappyThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0 
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const HappyThought = mongoose.model("HappyThought", HappyThoughtSchema)

//landing page
app.get("/", (req, res) => {
 
  const landingPage = {
    Hello: 
    "here is an api with three endpoints for the previous Happy Thoughts project",
    Routes: [{
      "/thoughts": "(GET request) Get the 20 most recent happy thoughts, sorted in descending order",
      "/thoughts": "(POST request) Post a new happy thought",
      "/thoughts/:thoughtId/like": "(POST request) finds a happy thought from the ID and updates it with one like",
    }]
  }
  res.send(landingPage)
  })

//get 20 most recent happy thoughts, sorted in descending order
app.get("/thoughts", async (req, res) => {
  const thoughts = await HappyThought.find().sort({ createdAt: 'desc' }).limit(20).exec()
  res.json(thoughts)
})

//post a new happy thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new HappyThought({ message: message }).save()
    res.status(201).json({ response: newThought, success: true })

  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})

//like a posted thought
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params

  try {
    const likesToUpdate = await HappyThought.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } })
    res.status(200).json({ response: likesToUpdate, success: true })

  } catch (error) {
    res.status(400).json({ response: error, success: false })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
