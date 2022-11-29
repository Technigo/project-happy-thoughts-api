import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy";
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

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 4,
    maxlenght: 30,
    trim: true,
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

// if connection to server is down, show below and don't move to routes
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ 
      status_code: 503,
      error: "Server unavailable" })
  }
})

// startpage 
app.get("/", (req, res) => {
  res.send({
    Message: "Welcome to the Happy Thoughts API",
    Routes: [{
      "/thoughts": "send a GET request to see all thoughts, or POST request to create a new Happy Thought!"
    }]
  });
});

// endpoint returns 20 thoughts, ordered by createdAt in descending order.
app.get("/thoughts", async (req, res) => {
  try {
    const thoughtList = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
    res.status(200).json(thoughtList)
  } catch (error) {
    res.status(400).json({success: false, response: error})
  }
});

// this endpoint expects a JSON body with the thought message, like this: { "message": "Express is great!" }. If the input is valid the thought will be saved and the response includes the saved thought object, including its _id.
app.post("/thoughts", async (req, res) => {
  const {message} = req.body;
  try {
    const newThought = await new Thought({message: message}).save();
    res.status(201).json({success: true, response: newThought})
  } catch(error) {
    res.status(400).json({success: false, response: error})
  }
});

// this endpoint finds a thought, and update its hearts property to add one heart.
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const {thoughtId} = req.params;
  try {
  const thoughtToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
  res.status(200).json({sucess: true, response: `Thought ${thoughtToUpdate.id} has their likes updated`});
} catch (error) {
  res.status(400).json({success: false, response: "id not found", error: error})
}
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
