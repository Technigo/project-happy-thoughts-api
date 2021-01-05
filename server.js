import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//creating model where we specify all the rules the client should follow to add data correctly 
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  createdAt: {
    type: Date,
    //provides the date at the moment when the request is sent and can't be modifed by user
    //default: () => new Date()
    default: Date.now
  },
  hearts: {
    //this number will be 0 by default even if the client sends another quantity
    type: Number,
    default: 0
  }  
}) 
// new Thought({message: "hey hey", hearts:8}).save();

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt:'desc'}).limit(20).exec();
  res.json(thoughts);
});

//posting an object to the database, if posted incorrectly the client receives errors
app.post('/thoughts', async (req, res) => {
  //Promises for learning purpose
  // new Thought(req.body).save()
  // .then((thought) =>{
  //   res.status(200).json(thought)
  // })
  // .catch((err) => {
  //   res.status(400).json({message:'Could not save thought', errors:err.errors});
  // })

  //Try catch
  try {
    //Success case

    //retrive the information sent by the client to our API endpoint
    const { message } = req.body
    //use mongoose model to create database entry and save it
    const thought = new Thought({ message });
    const savedThought = await thought.save();
    res.status(200).json(savedThought) 
  } catch(err) {
    //bad request sending the status to the server and the message
    res.status(400).json({message:'Could not save thought to the Database', errors:err.errors});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
