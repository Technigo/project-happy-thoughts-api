import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 140,
    trim: true
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema)

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
  res.send({
    Message: "Welcome to my Happy Thoughts API",
    Routes: [{
      "/thoughts": "Send a GET request to see all thoughts, or POST request to create a new Happy Thought"
    }]
  });
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughtList = await Thought.find().sort({createdAt: "desc"}).limit(20).exec();
    res.status(200).json(thoughtList);
  } catch (error) {
    res.status(400).json({success: false, response: error})
  }
});

app.post("/thoughts", async (req, res) => {
  const {message} = req.body;
  try {
    const newThought = await new Thought({message: message}).save();
    res.status(201).json({success: true, response: newThought})
  }catch (error){
    res.status(400).json({success: false, response: "Could not save message to the Database", error: error})
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
   const {thoughtId} = req.params;
   try {
    const thoughtToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
    res.status(200).json({success: true, response: `Thought ${thoughtToUpdate.id} has their likes updated`});
   } catch (error) {
    res.status(400).json({success: false, response: "Thought id not found", error: error});
   }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
