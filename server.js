import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happythought";
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
const navigation = {
    guide: "Routes for this API",
    Routes: [
      {
      "/thoughts": "Happy thoughts API"
      },
    ],
  };
  res.send(navigation);
});

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength:30,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

const Thought = mongoose.model("Thought", ThoughtSchema);

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
    try {
    const newThought = await new 
    Thought({message}).save()
    res.status(201).json({
      success: true, 
      response: newThought})
    } catch(err) {
      res.status(400).json({
      message: "Could not post this thought",
      response: err.errors,
      success: false,
    })}
});

app.get("/thoughts", async (req, res) => {
    try {
    const thoughts = await new 
    Thought.find().limit(20).sort({ createdAt: "desc" })
    res.status(200).json({
    success: true,
    response: thoughts
    })
  } catch (err) {
    res.status(400).json({
      message: "Could not find this post",
      response: err.errors,
      success: false,
    });
  }
});

app.patch("/members/:id/like", async (req, res) => {
   const { id } = req.params;
   try {
    const thoughtToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {heart: 1}});
    res.status(200).json({success: true, response: `Thought ${thoughtToUpdate.hearts} has been updated`});
   } catch (error) {
    res.status(400).json({success: false, response: error});
   }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
