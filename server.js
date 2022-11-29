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
  res.send('hey you! you are looking great today')
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await thoughts.find()
});

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 140,
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

app.post ('/thoughts', async (req, res) => {
  const {message} = req.body
  try {
    const newThought = await new Thought({message:message}).save()
    res.status(201).json({success: true, response: newThought})
  } catch(err) {
    res.status(400).json({success: false, error: err.errors})

  }
})

// app.post("/members", (req, res) => {
//   const {name, description} = req.body;

//     const newMember = new TechnigoMember({name: name, description: description}).save()
//     .then (data => {
//         res.status(201).json({success: true, response: data});
//       }).catch(error => {
//       res.status(400).json({success: false, error: error})
//     })
// });

// app.post("/members", (req, res) => {
//   const {name, description} = req.body;

//     const newMember = new TechnigoMember({name: name, description: description}).save((error, data) => {
//       if(error) {
//         res.status(400).json({success: false, response: error});
//       } else {
//         res.status(201).json({success: true, response: newMember});
//       } 
//     });
// });

app.patch("/thoughts/:id/heart", async (req, res) => {
  const { id } = req.params;
  try {
   const heartToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}});
   res.status(200).json({success: true, response: `the thought "${heartToUpdate.message}" has it's heart count updated`});
  } catch (error) {
   res.status(400).json({success: false, response: error});
  }
});
///////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
