import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-Happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtSchema = new mongoose.Schema({
 message: {
    type: String,
    required: true,
    unique: true,
    minlength:1,
    trim: true
  },
  hearth: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema);

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

app.get("/thoughts", async (req, res) => {
  const thought = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thought);
})

app.post("/thoughts", async (req, res) => {
  const {message, createdAt} = req.body;

  try {
    const newThought = await new Thought({message: message, createdAt: createdAt}).save();
    res.status(201).json({success: true, response: newThought});
  }catch (error){
    res.status(400).json({success: false, response: error});
  }
});

// we want to updated the like
app.patch("/thoughts/:id/hearth", async (req, res) => {
const { id } = req.params; // *deconstucting*
try {
  const hearthToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {hearth: 1}}) // ***when in doubt use this :) for this week  (according to Daniel)    !!!!!!!!!
  res.status(200).json({success: true, response: `Thought ${hearthToUpdate.name} has their likes updated`})
} catch (error) {
  res.status(400).json({success: false, response: error})
}
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
