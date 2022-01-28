import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

//Writing the schema for thoughts in happy-thoughts
const ThoughtSchema = new mongoose.Schema({      
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
    //enum: ['Example', 'example'] //limitation of values
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now 
  }
})

const Thought = mongoose.model('Thought', ThoughtSchema) //This connects the model to the schema above

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining routes here
app.get('/', (req, res) => {
  res.send('Hello happy world! To see the API live, go to: https://project-happy-thoughts-jessica-nordahl.netlify.app/')
})

// Endpoint to return maximum 20 thoughts
app.get('/thoughts', async (req, res) => {
	try {
		const thoughtsList = await Thought.find({})
			.sort({ createdAt: 'desc' })
			.limit(20);
		res.status(200).json(thoughtsList);    
  } catch (error) {
		// If above code is unsuccessful, status code = bad request:
		res.status(400).json({ 
      response: error, 
      success: false });
	}
});  

// Endpoint o add a new thought
app.post('/thoughts', async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought ({ message }).save() //asynchronous code with await
    res.status(201).json({ 
      response: newThought, 
      success: true }) //status created
  } catch (error) {
    res.status(400).json({ 
      response: error, 
      success: false }) 
  }
})

// Endpoint to increase the hearts/likes per thought
app.post('/thoughts/:thoughtsId/like', async (req, res)=> {
  //we find the member by id
  const { thoughtsId } = req.params

  try {
  const updatedLike = await Thought.findByIdAndUpdate(
    thoughtsId, 
    { $inc: 
      { like: 1 //this makes the score update with 1 like, at every update 
      },
    },
  { new: true }
  )
if (updatedLike) {
  res.status(201).json({ 
    response: success, 
    success: true })
} else {
  res.status(404).json({ 
    response: error, 
    success: false });
}
} catch (error){ 
    res.status(400).json({ 
      response: error, 
      message: "Couldn't update like", 
      success: false });
  }
})

// Endpoint to delete a specific thought/message
app.delete("/thoughts/:thoughtId/delete", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const deletedThought = await Thought.findByIdAndDelete(thoughtId);
    if (deletedThought) {
      res.status(200).json({ 
        response: deletedThought, 
        success: true });
    } else {
      res.status(404).json({ 
        response: "Message not found!", 
        success: false });
    }
  } catch (error) {
    res.status(400).json({ 
      message: "Bad request", 
      response: error, 
      success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
