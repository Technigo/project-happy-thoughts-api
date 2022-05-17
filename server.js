import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: ()=> new Date()
  },
});

const Thought = mongoose.model('Thought', ThoughtSchema); 

///////////////////////////////////////////////////////

// const TechnigoMemberSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//     enum: ['Karin', 'Petra', 'Matilda', 'Poya', 'Daniel']
//   },
//   description: {
//     type: String,
//     minlength: 4,
//     maxlength: 30,
//     trim: true
//   },
//   score: {
//     type: Number,
//     defualt: 0
//   },
//   createdAt: {
//     type: Date,
//     default: ()=> new Date()
//   }
// });

// const TechnigoMember = mongoose.model('TechnigoMember', TechnigoMemberSchema);

///POST request
// app.post('/members', async (req, res) => {
//   const { name, description } = req.body;
//   console.log(req.body);
//   try {
//     const newMember = await new TechnigoMember({name: name, description: description}).save()
//     res.status(201).json({response: newMember, success: true})
//   } catch (error) {
//     res.status(400).json({response: error, success: false});
//   }
// });

////////////////////////////////////////////////////////


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
  res.send("Hello! This is the backend-part of a previous project called Happy Thoughts.");
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find()
    .sort({createdAt: 'desc'})
    .limit(20).exec();

    try {
      res.status(200).json({
        data: thoughts,
        success: true
      });
    } catch (error) {
      res.status(400).json({
        response: 'Could not return message',
        success: false});
    }
    
});

////////// POST request for code along ////////////////////
// app.post('/tasks', async (req, res) => {
// //Retrieve the information sent by the client to our API endpoint
//   const { text, complete } = req.body;

// //use our mongoose.model to create the database entry
//   const task = new Thought({text, complete});

//   try {
//     const savedTask = await task.save();
//     res.status(201).json(savedTask)
//   } catch (error) {
//     res.status(400).json({response: error, success: false})
//   }
// })
//////////////////////////////

app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message: message}).save()
    res.status(201).json({
      response: newThought,
      success: true});
  } catch (error) { 
    res.status(400).json({
      response: 'Could not save message',
      success: false
    });
  }
});


app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedLikes = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}});
    res.status(200).json({
      response: updatedLikes,
      success: true}); 
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
