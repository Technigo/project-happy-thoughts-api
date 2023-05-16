import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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

// Start defining your routes here (endpoints)
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

//In order to store the database we need a database model 
const { Schema } = mongoose;
const ThoughtSchema = new Schema({
  message: {
   type: String,
   required: true,
   minlength: 4,
   maxlength: 20
},
 createdAt: {
  type: Date,
  default: new Date()
 }, 
 hearts: {
  type: Number,
  default: 0
 }
});

const Thought = mongoose.model("Thought", ThoughtSchema);

// GET - a thought, modify when nothing found
app.get("/thoughts", async (req, res) => {
  try {
    const thought = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({
      success: true,
      response: thought,
      message: "Thoughts retrieved successfully"
    });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not successfully"
     });
  }
});

//POST-create something
app.post("/thoughts", async (req, res) =>{
  const {message} = req.body;
  const thought = new Thought ({ message })
  try {
    const newThought = await thought.save();
    res.status(201).json({
      success: true,
      response: newThought,
      message: "Created successfully"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Could not save your thought"
    });
  }
});

// POST thoughts/:thoughtId/like
// app.post("/thoughts/:thoughtId/like", async (req, res)=>{
//   try{
//         const likes = await Thought.findOneAndUpdate(
//           { "_id": req.params.thoughtId }, //filters and required
//           { $inc: { "hearts": 1 } }, //updates and required
//           { new: true } //updates the numbers of hearts in POST
//         )
//         res.status(201).json(likes)
//   } catch (err) {
//     res.status(400).json({ message: "Could not save your like", error: err.errors})
//   }
// })


//PATCH- to update like-count

// Patch for updating like-count
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  //id from url :param
  const { thoughtId } = req.params;
  // if id is found increases heart count by one
  try {
    const liked = await Thought.findByIdAndUpdate(thoughtId,{ $inc: { heart: 1 } });
    res.status(200).json(liked);
  } catch (e) {
    res.status(400).json({
      success: false,
      message: 'Could not like thought',
      error: e});
    }
  });

// app.patch("/thoughts/:id", async (req,res) => {
//  const { id } = req.params;
//  try {
//  const thought = await Thoughts.findById(id);
//  res.status(200).json({
//   success: true,
//   response: thought,
//   message: "Created successfully"
// });
//  } catch(e) {
//   res.status(400).json({
//     success: false,
//     response: e,
//     message: "Error occured"
//   });
//  }

// });




// delete
app.delete("/thought/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const thought = await Thoughts.findByIdAndRemove(id);
    res.status(200).json({
      success: true,
      response: thought,
      message: "deleted successfully"
     });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not successfully"
     });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
