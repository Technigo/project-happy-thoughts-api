// //////////////////////////////////////////////////////////////////////// //
// /////////////////////////////// IMPORT ///////////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

import express from "express"; 
import cors from "cors";
import mongoose from "mongoose";

// //////////////////////////////////////////////////////////////////////// //
// //////////////////// CONNECTION TO DISPLAY ///////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// //////////////////////////////////////////////////////////////////////// //
// //////////////////////////// SCHEMA //////////////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

const ThoughtsListSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}); 

const ThoughtsList = mongoose.model("ThoughtsList", ThoughtsListSchema);

// //////////////////////////////////////////////////////////////////////// //
// //////////////////////////// STARTPAGE ///////////////////////////////// //
// //////////////////////////////////////////////////////////////////////// //

app.get("/", (req, res) => {
  res.send({
    "Hello": "Welcome to this Happy Thought API!",
    "Endpoints": [
    {"/": "Startpage / Api Info"},
    {"/thoughts": "GET. See 20 thoughts in descending order"},
    {"/thoughts": "POST. Post your thoughts"},
    {"/thoughts/:thoughtId/like": "POST. Update likes"}
    ]
    });
});

// ///////////////////////////////////////////////////////////////////// //
// //////////////////////////// GET //////////////////////////////////// //
// ///////////////////////////////////////////////////////////////////// //

app.get("/thoughts", async (req, res) => {
  const displayedThoughts = await ThoughtsList.find().sort({createdAt: 'desc'}).limit(20).exec();
    try {
      res.status(200).json({
        success: true, 
        response: displayedThoughts,
        message: "Successfully found thoughts"
      });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Did not find thoughts", 
      error: e.errors
     });
  }
});

// ////////////////////////////////////////////////////////////////////// //
// //////////////////////////// POST //////////////////////////////////// //
// ////////////////////////////////////////////////////////////////////// //

app.post('/thoughts', async (req, res) => {
  const { message, createdAt } = req.body;
  try {
    const savedThought = await new ThoughtsList({ message, createdAt }).save();
    res.status(201).json({
      success: true, 
      message: "Post successfull", 
      response: savedThought
    });
  }
  catch (e){
    res.status(400).json({
      success: false, 
      response: e,
      message: 'Could not save thought to database', 
      error:err.errors 
    });
  }
});

// /////////////////////////////////////////////////////////////////////// //
// //////////////////////////// LIKES //////////////////////////////////// //
// /////////////////////////////////////////////////////////////////////// //

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { id } = req.params;
  try {
   const updateLikes = await ThoughtsList.findByIdAndUpdate({ _id: req.params.id }, { $inc: { hearts: 1 } }, { new: true });
   res.status(200).json({
    success: true, 
    response: `Thought: ${updateLikes.message} has updated likes`
  });
  } catch (e) {
   res.status(400).json({
    success: false, 
    message: 'Could not save like to thought',
    response: e
  });
  }
});

// /////////////////////////////////////////////////////////////////////// //
// //////////////////////////// START SERVER //////////////////////////////// //
// /////////////////////////////////////////////////////////////////////// //

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
