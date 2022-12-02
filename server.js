import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


const Thought = mongoose.model('Thought', {

  message: {
    type: String,
    required: true,
    minlength: 5
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now //daniel sa under föreläsning att man behöver använda typ () = new Date för att få datumet när posten skapas
  }

  })

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send({
    Message:"Welcome to Happy Thoughts API! Here is a list of accessible endpoints.", 
    endpoints: 
      {'GET': '/thoughts to get the 20 latest thoughs from the database',
      'POST' : '/thougths to post new message',
      'PATCH' : '/thougths/:thoughtId/like to like a posted message'
     }
    });
});

//should return a maximum of 20 thoughts with the most recent at the top
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.status(200).json({thoughts});
})


app.post("/thoughts", async (req, res) => {
  // retrieve info sent by client to api endpoint
  const {message} = req.body;
  // use Thought mongoose model to create database entry
  const happyThought = new Thought({message});

  try {
    const savedHappyThought = await happyThought.save();
    res.status(201).json(savedHappyThought)
  }
  catch (err) {
    res.status(400).json({
      message: 'Could not save thought to the database', 
      error: err.errors
    })
  }
})

app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
   const updatedLikes = await Thought.findByIdAndUpdate(thoughtId, {$inc: {likes: 1}});
   res.status(200).json({success: true, response: `Likes updated for id ${updatedLikes._id}`});
  } catch (error) {
   res.status(400).json({success: false, response: error});
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
