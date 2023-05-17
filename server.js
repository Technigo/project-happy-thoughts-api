import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
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
const listEndpoints = require('express-list-endpoints');

const { Schema } = mongoose;
const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength:140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: ()=> new Date()
  }
});

const Thoughts = mongoose.model("Thoughts", ThoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(listEndpoints(app));
});




app.post("/thoughts", async (req, res) =>{
  try{
const newThought = new Thoughts({message: req.body.message });
await newThought.save();
res.status(201).json(newThought);
  } catch (error) {
    res.status(400).json({error: "error occurred" });
  }
});

app.patch("/thoughts:id/like", async (req, res) => {
  const { id } = req.params;
  const { newDescription } = req.body;
  try{
  const updatedHearts = await Thoughts.findByIdAndUpdate(id, {$inc: {hearts: 1}});
  res.status(200).json({
    success: true,
    message: "updated successfully"
  })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Something went wrong"
    })
  }
});

app.delete("/thoughts:id", async (req, res) => {
  const { id } = req.params;
  try{
  const Thought = await Thoughts.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "deleted successfully"
  })
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Something went wrong"
    })
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
