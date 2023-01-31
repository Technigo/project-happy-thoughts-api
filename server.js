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

// Start here
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0,
    max: 1
  },
  createdAt: {
   type: Date,
   default: () => new Date()
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Veronika & Honza 2023");
});

// The post request - to read from database
app.get('/post', async (req, res) =>{
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts);
})

// To add items to the database
app.post('/info', async(req, res) =>{
  // Collect the information sent by the client to our API 
  const {message} = req.body;
  // Use our mongoose model to create the database entry - to save
  const thought = new Thought({message})
  try{
    const savedThought = await thought.save();
  res.status(201).json(savedThought);
  }catch(err){
    res.status(400).json({message: 'Could not save thought to the database', errors: err.errors});
  }
})

//PATCH => change/modify individual stuff
app.patch("/info/:id/like", async (req, res) => {
  const { id } = req.params;
  const opts = { runValidators: true };
  try{
    const likeToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}}, opts);
    res.status(200).json({success: true, response:`Like ${likeToUpdate.id} has their like updated`})
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});