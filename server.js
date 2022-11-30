import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUrl = /* process.env.MONGO_URL || */ "mongodb://localhost/project-happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


const Thought = mongoose.model('Thought', {

  message: {
    type: String,
    required: true,
    minlength: 5
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now //daniel sa under föreläsning att man behöver använda typ () = new Date för att få datumet när posten skapas
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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Here will be a list of endpoints");
});

//should return a maximum of 20 thoughts with the most recent at the top
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  res.json(thoughts);
})

//expects a json body with {"message" : "Random thought"}. If valid, thought should
//be saved. Response (res) should include the saved object, including it's _id.
app.post("/thoughts", async (req, res) => {
  // retrieve info sent by client to api endpoint
  const {message} = req.body;
  // use Thought mongoose model to create database entry
  const happyThought = new Thought({message});

  try {
    const savedHappyThought = await happyThought.save();
    res.status(201).json(savedHappyThought)
  }
  catch (err) {
    res.status(400).json({
      message: 'Could not save thought to the database', 
      error: err.errors
    })
  }
})

//This endpoint doesn't require a JSON body. Given a valid thought id in the URL, 
//the API should find that thought, and update its hearts property to add one heart.
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const {id, likes} = req.body;
   try {
    const likedThought = await Thought.findById(id).exec();
    likedThought.likes +=1;
    console.log(likedThought.likes);
    likedThought.save()
    res.status(201).json(likedThought)
   }
   catch (err) {
    res.status(400).json({
      message: 'Could not like selected thought',
      error: err.errors
    })
   }

})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
