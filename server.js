import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-happy-thought-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining routes here
const listEndpoints = require('express-list-endpoints');

app.get("/", (req, res) => {
  const text = "Happy Thoughts API - Joanna Philips";
  const endpoints = (listEndpoints(app))
  
  res.send({
    body: {
      text,
      endpoints
    }
  });
});

const { Schema } = mongoose;
const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  hearts: {
    type: Number,
    default: 0
  },
  username: {
    type: String,
    default: "Anonymous",
    minlength: 2,
    maxlength: 20,
  },
  tag: {
    type: String,
    default: "random",
    minlength: 1,
    maxlength: 10,
  }
}); 

const Thought = mongoose.model("Thought", ThoughtSchema);

//Get all thoughts with paging, params are page and limit
app.get("/thoughts", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const skip = (page - 1) * limit; // Calculate skip value - how many entries to skip from the beginning of the dataset

    const thoughtsList = await Thought.find().limit(limit).skip(skip).sort({ createdAt: "desc" })

    if (thoughtsList.length > 0) {
      res.status(200).json({
        success: true,
        body: {
          thoughtsList: thoughtsList,
          currentPage: page,
          totalPages: Math.ceil(await Thought.countDocuments() / limit), // Eg: 50 / 10 = 5 pages
          totalThoughtsCount: await Thought.countDocuments() // Counts total number of thoughts in the DB

        }
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "No thoughts found in the list"
        }
      });
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    });
  }
});

//Post a new thought
app.post("/thoughts", async (req, res)=>{
  const {message, username, tag} = req.body;
  console.log(req.body )
    try{
      const thought = {};
      thought.message = message;
      
      if(username != '')
        thought.username = username;

      if(tag != '')
        thought.tag = tag;

      const thoughtItem = await new Thought(thought).save();
      res.status(201).json({
       success: true,
        response: thoughtItem,
        message: "Thought posted successfully"
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        response: e,
        message: "Thought posting failed"
       });
     }
 });

// Add a heart (like) to a specific post recognised by id
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const likedThought = await Thought.findByIdAndUpdate(thoughtId, {
      $inc: { hearts: 1},
    });
    res.status(200).json({
      success: true,
      response: likedThought,
      message: "Like added"
     });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Like not added"
     });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
