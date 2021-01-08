import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

//predifining errors
const ERR_CANNOT_SAVE_TO_DATABASE = 'Could not save thought to the Database';

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
    default: Date.now
  },
 
  hearts: {
    //this number will be 0 by default even if the client sends another quantity
    type: Number,
    default: 0
  }  
}) 

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt:'desc'}).limit(20).exec();
  res.json(thoughts);
});

//posting an object to the database, if posted incorrectly the client receives errors
app.post('/thoughts', async (req, res) => {
  //Try catch
  try {
    //Success case
    //retrive the information sent by the client to our API endpoint
    const { message } = req.body
    //we sent only message because we need to have only message from the client 
    const thought = new Thought({ message });
    const savedThought = await thought.save();
    res.status(200).json(savedThought) 
  } catch(err) {
    //bad request sending the status to the server and the message
    res.status(400).json({message: ERR_CANNOT_SAVE_TO_DATABASE, errors:err.errors});
  }
});

app.post('/thoughts/:id/like', async(req,res)=>{
  const { id } = req.params;
  //const { like } = req.body;
  await Thought.updateOne( {_id: id}, { $inc: {hearts: 1} });
  res.status(200).json({success: true});
})

///delete endpoint/
app.delete('/thoughts/:id', async(req,res)=>{
  try{
    //try to delete and send a successful response
    const{ id } = req.params;
    await Thought.deleteOne({ _id: id });
    res.status(200).json({ success: true });
  } catch(error) {
    console.log(error)
    //inform the client about the deletion failure
    res.status(400).json({ success:false });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
