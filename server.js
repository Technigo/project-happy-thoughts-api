import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const listEndpoints = require('express-list-endpoints');

app.use(cors());
app.use(express.json());

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
    default: Date.now()
  }
}); 

const Thought = mongoose.model("Thought", ThoughtSchema);

app.get("/", (req, res) => {
  res.status(200).send({
    succes: true,
    message: "OK",
    body: {
      conent: "Happy Thoughs API",
      endpoints: listEndpoints(app)
    }
  });
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.status(200).json(thoughts);
});

app.get("/thoughts/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleThought = await Thought.findById(id)
    if (singleThought) {
      res.status(200).json(singleThought);
    } else {
      res.status(400).json('Not found');
    }
    } catch (e) {
      res.status(400).json('No id found');
    }
});

app.post("/thoughts", async (req, res) =>{
  const { message } = req.body;
    try {
      const thought = await new Thought({ message }).save();
      res.status(201).json({
        succes: true,
        response: thought,
        message: "Created with success"
      });
    } catch (e) {
      res.status(400).json({
        succes: false,
        response: e,
        message: "Error occured when posting"
      });
    }
});

app.patch("/thoughts/:_id/like", async (req, res) => {
  const { _id } = req.params; 
  try {
    const thought = await Thought.findByIdAndUpdate(
      _id,
      { $inc: { heart: 1 } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      response: thought,
      message: "Like received successfully"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "An error occurred when liking"
    });
  }
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});