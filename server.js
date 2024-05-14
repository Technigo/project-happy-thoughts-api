import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import expressListEndpoints from 'express-list-endpoints';
import dotenv from "dotenv"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const {Schema, model} = mongoose

const thoughtsSchema = new Schema({
  message:{
    type: String,
    required: true,
    minLength: 5,
    maxLength: 140
  },
  hearts:{
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

const Thought = model ("Thought", thoughtsSchema)
// const likeSchema = new Schema({

// })
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

dotenv.config()

const port = process.env.PORT || 8000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints)
});

app.get("/thoughts", async (req, res) => {
  try{
    const thoughts = await Thought.find().sort({createdAt: -1}).limit(20).exec()


  res.json(thoughts)
  } catch (error) {
    res.status(400).send("Happy thoughts is not found.")
  }
  
})
app.post("/thoughts", async (req,res)=> {
  const {message} = req.body

  try {
    const thought = await new Thought({message}).save()

    res.status(201).json({
      success: true,
      response: thought,
      message: "New thought has been sent successfully."
    })
  } catch (error) {
  res.status(400).json({
    success: false,
    response: error,
    message: "Thoughts couldn't be sent."
  })
}
}) 




console.log(new Date())
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
