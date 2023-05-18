import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/happythoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

const { Schema } = mongoose;

const thoughtSchema = new Schema({
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
    default: new Date()
  }
});

const Thought = mongoose.model("Thought", thoughtSchema)

app.get('/thoughts', async (req, res) => {
  const response = {
    success: true,
    body:{}
  }

  try {
    const allThoughts = await Thought.find().sort({createdAt:'desc'}).limit(20);
    if(allThoughts){
      response.body = allThoughts
      res.status(200).json(response)
    } else {
      response.success = false
      response.body = {message: "No thoughts to be found."}
      res.status(404).json(response)
    }
  } catch (error) {
    response.success = false
    response.body = {message: error}
    res.status(500).json(response)
  }
})

app.post('/thoughts', async (req, res) =>{
  const response = {
    success: true,
    body:{}
  }
  const {message} = req.body;
  try{
    const thought = await new Thought({message}).save()
    response.body = thought
    res.status(201).json(response)
  } catch (error) {
    response.success = false
    response.body = {message: error}
    res.status(400).json(response)
  }
})

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params
  const response = {
    success: true, 
    body: {}
  }
  
  try {
    const likedThought = await Thought.findById(thoughtId);
    const addHeart = likedThought.hearts + 1;
    // console.log(likedThought)
    const updateHearts = await Thought.findByIdAndUpdate(thoughtId, {hearts: addHeart})
    // console.log(updateHearts)
    response.body = updateHearts
    res.status(201).json(response)
  } catch (error) {
    response.success = false
    response.body = {message: error}
    res.status(400).json(response)
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
