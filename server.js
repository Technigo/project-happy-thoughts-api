import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config ()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const port = process.env.PORT || 5000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },

  hearts: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: ()=> new Date()
  },
});

const thought = mongoose.model('Thought', ThoughtSchema);

// Start defining your routes here
app.get('/', (req, res) => {
  const main = {
  Welcome: 'Happy thoughts api',
};
  res.send(main);
  });



app.get('/thoughts', (req, res) => {
  try {
  const thoughts = await Thought.find().sort({createdAt:'desc'}).limit(20).exec();
  res.status(200).json(thoughts);

} catch(error) {
    res.status(400).json({
    message:'Please try again',
    error: err.errors,
    });
  }
});
      
app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

 try {
   const newThought = await new Thought({message}).save();
  res.status(200).json({
    respons: newThought,
    success:true
  })
  } catch(error) {
    res.status(400).json({
      message: 'Please try again!',
      error: err.errors,
      sucess:false,

    });
 }
});

 app.post('/thoughts/:thoughtId/like', async (req, res) => {
   const { thoughtId } = req.params;

try {
  const newMessage = await new Message.findByIdAndUpdate(thoughtId, {
    $inc: { hearts: 1 },
  })
  res.status(200).json(newMessage);
   
} catch(error) {
  res.status(400).json({
    message: 'Please try again!',
    error: err.errors,
    sucess:false,

  });
}

});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
