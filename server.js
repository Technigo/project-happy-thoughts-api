import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//Schema allows us to reuse code
//We can combine a schema for certain propertys that shall remain together with properties that shall vary
//enum will add the only acceptable names to be able to pass to the name property
//trim deletes whitespace from beginning and end of string - not in between
//new Date needs to have anonymus function in order not to execute when page loads
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    trim: true
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

//Mongoose model allows of to use the methods like findings
const Thought = mongoose.model("Thought", ThoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/thoughts", async (req, res) => {
  const {page, perPage} = req.query;
  try {
  const thoughts = await Thought.find({}).sort({createdAt: -1})
    .skip((page -1) * perPage).limit(perPage)
  res.status(200).json({success: true, response: thoughts});
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
});

//POST request with async await
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  console.log(req.body);
  try {
    const newThought =  await new Thought({message: message}).save();

    res.status(201).json({response: newThought, success: true});
  } catch(error) {

    res.status(400).json({response: error, success: false});
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    //score updated first after the find is made therfor not visible in response
    const thoughtToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
    res.status(200).json({response: `Thought ${thoughtToUpdate.message} has been updated`, success: true});
  } catch (error) {
    res.status(400).json({response: error, success: false});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

