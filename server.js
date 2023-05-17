import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import listEndpoints from 'express-list-endpoints';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());


// Schemas and models constructed here:

const { Schema } = mongoose;

const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
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

const Thought = mongoose.model('Thought', ThoughtSchema)



app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "OK",
    body: {
      content: "Matildas Happy Thoughts API",
      endpoints: listEndpoints(app)
    }
  });
});


// Fetches the thoughts from the API, using pagination
app.get("/thoughts", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page (default: 1)
  const limit = parseInt(req.query.limit) || 20; // Number of thoughts per page (default: 20)

  // /thoughts?page=2&limit=10

  try {
    const totalThoughts = await Thought.countDocuments(); // Counts thoughts
    const totalPages = Math.ceil(totalThoughts / limit); // Calculate total pages, rounding upwards to an integer

    
    const thoughts = await Thought.find()
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * limit)  // Basically sets where to start showing the thoughts (skipping the ones before it)
      // E.g: If page is 3 and limit is 20, the skip value would be 40. This means that for the third page, we need to skip the first 40 thoughts in the sorted result.
      .limit(limit)   // We change this to a variable instead of fixed 20
      .exec();
  
    res.status(200).json({
      success: true,
      message: 'Thoughts fetched successfully',
      currentPage: page,
      totalPages: totalPages,
      totalThoughts: totalThoughts,
      thoughts: thoughts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error occurred while fetching thoughts',
      error: err.message
    });
  }
});


// Post a new thought to the API
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const thought = await new Thought({ message }).save();
    res.status(201).json({
      success: true,
      message: 'Thought posted successfully',
      response: thought
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Error occurred while trying to post the thought',
      response: err
    })
  }
});


// Accessing a single thought by _id
// E.g. http://localhost:8080/thoughts/6463dda65e61139a83f59492
app.get("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleThought = await Thought.findById(id)
    if (singleThought) {
      res.status(200).json({      
        success: true,
        message: `Thought with id ${id} found`,
        response: singleThought
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Id ${id} - Not found`,
        response: err
      })
    }
    } catch (err) {
      res.status(400).json({
        success: false,
        message: 'Error occurred while trying to access the thought',
        response: err
      })
    }
});

// Patch = update
// E.g. http://localhost:8080/thoughts/6463dda65e61139a83f59492/like
// Updating the heart property on a specific thought
app.patch("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    // Find the thought by ID and increment the 'heart' field by 1
    const thought = await Thought.findByIdAndUpdate(id, { $inc: { heart: 1 } }, { new: true });
    if (thought) {
      res.status(201).json({
        success: true,
        message: `Like updated successfully for post with id ${id}`,
        response: thought
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Thought with the given id ${id} not found`,
        response: null
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: `Error occurred while trying to update the like`,
      response: err
    });
  }
});


// Error handling middleware, for catching unexpected errors.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err.message
  });
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
