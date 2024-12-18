import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

//const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/thoughts";

const mongoURI = process.env.MONGODB_URI

mongoose.connect(mongoURI)
.then(() => {
  console.log('MongoDB successfully connected!')
  })
  .catch((error) => {
  console.error('Error to connect with MongoDB', error)
  })

//mongoose.Promise = Promise;

// Setting a Schema and model
const Thought = mongoose.model("Thought", new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 500
  },
  heart: {
    type: Boolean,
    default: false
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId, //stores preferences to user object
    ref:"User"
  }],
  createdAt: {
    type: Date,
    default: () => new Date()
  }
}))

//check if validation is working
new Thought({message: "hallo"}).save();

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
  try {
    // returning 20 thoughts in descending order
    const thoughts = await Thought.find().sort({createAt: "desc"}).limit(20).exec();
    res.json(thoughts)
  }catch (error) {
    console.error('Error retrieving thoughts', error);
      res.status(500).send('Server error');
  }
  });

  app.post("/thoughts", async (req, res) => {
    try{
      //retrieve the information sent by the client to our API endpoint
      const {message, heart} = req.body;
      //use the mongoose model to create the DB entry
      const newThought = new Thought({
        message,
        heart,
      });
      await newThought.save();

      res.status(201).json(newThought);
    } catch(error) {
      res.status(400).json({message: "Could not save thought", errors: error.err.errors})
    }
    });
    app.post("/thoughts/:id/like", async (req, res) => {
    })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});