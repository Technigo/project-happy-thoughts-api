import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-happy-thoughts-api";
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
const listEndpoints = require('express-list-endpoints')

const { Schema } = mongoose;
const HappyThoughtSchema = new Schema({
  message: {
    // type is the most important one
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    // removes unnecessary whitespaces from string
    trim: true
  },
  hearts: {
    type: Number,
    default: 0,
    set: function (value) {
    return 0
    }
  },
  createdAt: {
    type: Date, 
    default: new Date()
  }
})

const HappyThought = mongoose.model("HappyThought", HappyThoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/thoughts", async (req, res) => {
    const thoughts = await HappyThought.find().sort({createdAt: 'desc'}).limit(20).exec();
      try {
        res.status(201).json({
          success: true,
          response: thoughts,
          message: "thought fetched successfully"
        })
      } catch (e) {
        res.status(400).json({
          success: false,
          response: e,
          message: "error occured when fetching thought"
      })
      }
})

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const thought = await new HappyThought({message}).save();
    try {
        res.status(201).json({
        success: true,
        response: thought,
        message: "thought posted successfully"
      })
    } catch (e) {
      res.status(400).json({
        success: false,
        response: e,
        message: "error occured when posting thought"
    })
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
    try {
      const likedThought = await HappyThought.findById(req.params.id);
      if (likedThought) {
        likedThought.hearts +=1
        await likedThought.save()
        res.status(201).json({
          success: true,
          response: thought,
          message: "thought created successfully"
        })
      } else {
        res.status(400) ({
          success: false,
          message: "could not like thought"
        })
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        response: e,
        message: "error"
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
