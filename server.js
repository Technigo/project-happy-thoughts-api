import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-happy-thoughts-api";
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

//////// Live sesh //////////
const { Schema } = mongoose;
const ThoughtSchema = new Schema ({
  message: {
    // Most important one is:
    type: String,
    // required is true or false
    required: true,
    minlength: 4,
    maxlength: 140,
    //removes unnecessary white spaces from string
    trim: true
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  })

const Thought = mongoose.model("Thought", ThoughtSchema)

app.get('/thoughts', async (req, res) => {
  const displayThoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
    res.json(displayThoughts)
})

app.post('/thoughts', async (req, res) => {
  const { message, createdAt } = req.body;
  try {
    const savedThought = await new Thought({ message, createdAt }).save();
    res.status(201).json({
      success: true, 
      message: "Posted!", 
      response: savedThought
    });
  }
  catch (e){
    res.status(400).json({
      success: false, 
      response: e,
      message: 'Could not save thought to database'
    });
  }
})

app.post('/thoughts/:thoughtId/likes', async (req, res) => {
  const { thoughtId } = req.params;
  try {
   const updateLikes = await Thought.findByIdAndUpdate(thoughtId, { $inc: { likes: 1 }});
   res.status(200).json({
    success: true, 
    response: `Thought: ${updateLikes.message} has updated likes`
  });
  } catch (e) {
   res.status(400).json({
    success: false, 
    message: 'Could not save like to thought',
    response: e
  });
  }
})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
