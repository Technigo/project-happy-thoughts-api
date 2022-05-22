import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts-api";
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

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  hearts: {
     type: Number,
     default: 0
  }

})

const Thought = mongoose.model('Thought', ThoughtSchema)

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

// Get all messages/thoughts

app.get('/thoughts', async (req,res) => {
const {page, perPage} = req.query

try {
   const thoughts = await Thought.find().sort({ 
    createdAt: 'desc'
  })
  .limit(20)
  .exec()

  res.status(200).json({success: true, response: thoughts})

} catch (error) {
  res.status(400).json({success: false, response: error})
}
})

//Post a new thought

app.post('/thoughts', async (req, res) => {

const { message } = req.body

const thought = await new Thought({ message: message}).save()

try{
const savedThought = await thought.save()
res.status(201).json({ 
  response: savedThought, 
  success: true
})
}catch (err){
res.status(400).json({
  response: error,
   success: false
  })
}
})

//add likes to a thought

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId, } = req.params
  try{
    const thoughtLiked = Thought.findByIdAndUpdate(thoughtId, 
       {$inc: {hearts: 1}})
    res.status(200).json({
      response: `This happy thought ${thoughtLiked.message} got liked!`,
       success: true
      })
  } catch (error) {
    res.status(400).json({
      response: error,
       success: false
      })
  }
})

//delete a sent thought

app.delete('/thoughts/:thoughtId', async (req, res) => {
  const { id } = req.params

  try {
  // const deletedThought = Thought.deleteOne({_id: id})
  const deletedThought = await Thought.findOneAndDelete({_id: id})
  res.status(200).json({success: true, response: deletedThought})
  } catch (error)  {
    res.status(400).json({success: false, response: error})
  }
   
})

// app.get('/thoughts', async (req, res) => {
//   const thoughts = await Thought.find({})
//   res.status(200).json({success: true, response: thoughts})
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
