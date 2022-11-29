import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/my-happy-project";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thoughts = mongoose.model('Thought', {
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
    default: () => new Date()
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//Daniel


// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/thoughts", async (req, res) => {
  const thought = await Thoughts.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thought);
});

app.post("/thoughts", async (req, res) => {
  // retrieve info sent by clients to our API endpoint
  const {message, heart} = req.body;
  // use mongoose model to create the database entry
  const newTask = new Thoughts({message, heart})
  try{
    const savedThoughts = await newTask.save();
    res.status(201).json(savedThoughts);
  }catch (err){
    res.status(400).json({message:'cannot post thoughts', errors: err.errors})
  }
});

app.post("/thoughts/:id/heart", async (req,res) => {
  const { id } = req.params;
  try{
    const heartsUpdate = await Thoughts.findByIdAndUpdate(id, {$inc: {heart: 1}});
    res.status(200).json({success: true, response: `Heart ${heartsUpdate.message} has their heart updated`});
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


/* 
app.patch("/members/:id/score", async (req, res) => {
   const { id } = req.params;
   try {
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}});
    res.status(200).json({success: true, response: `Member ${memberToUpdate.name} has their score updated`});
   } catch (error) {
    res.status(400).json({success: false, response: error});
   }
});
*/