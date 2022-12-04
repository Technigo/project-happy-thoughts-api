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

// Start defining your routes here
app.get("/", (req, res) => {
  res.json({
    responseMessage: "Happy Thoughts API by Linnéa Ajger ",
    endpoints: 
      {
        "/thoughts": "use this endpoint with POST or PATCH to update or save to the database",
        "/thoughts?page=<page number>&perPage=<numbers per page>": "Give you the thoughts sorted with the latest one in the top",
        "/thoughts/mostliked": "Sorts the list of thoughts with the one with most hearts at the top",
        "/thoughts/oldest": "Gives you the oldest thought first"
      }});
});

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date ()
  }
})

const Thought = mongoose.model('Thought', ThoughtSchema)

app.get("/thoughts", async (req, res) => {
 
  const { page, perPage, numberPage = +page, numberPerPage = +perPage } = req.query;
  try {
    const thoughts = await Thought.aggregate([
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: (numberPage - 1) * numberPerPage
      },
      {
        $limit: numberPerPage
      }
    ]);
    res.status(200).json({success: true, response: thoughts});
  }
 catch (error) {
    res.status(400).json({success: false, response: error});
  }
});

app.get("/thoughts/mostliked", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({hearts: - 1}).limit(20).exec()
    res.status(200).json({success: true, response: thoughts});
  }
  catch (error) {
  res.status(400).json({success: false, response: error});
  }
})

app.get("/thoughts/oldest", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({createdAt: 1}).limit(20).exec()
    res.status(200).json({success: true, response: thoughts});
  }
  catch (error) {
  res.status(400).json({success: false, response: error});
  }
})


app.post ('/thoughts', async (req, res) => {
  try {
    const newThought = await new Thought({ message: req.body.message }).save()
    res.status(201).json({success: true, response: newThought})
  } catch(err) {
    res.status(400).json({success: false, error: err})

  }
})

app.patch("/thoughts/:id/heart", async (req, res) => {
  const { id } = req.params;
  try {
   const heartToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}});
   res.status(200).json({success: true, response: `the thought "${heartToUpdate.message}" has it's heart count updated`});
  } catch (error) {
   res.status(400).json({success: false, response: error});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
