import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
//mongodb+srv://annaholly:WAfV2IEidqVDmDR5@cluster0-trdcw.mongodb.net/happyThoughts?retryWrites=true&w=majority

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Thought = mongoose.model('Thought', {
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
    default: Date.now
  },
  tag: {
    type: String
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
//app.get('/', (req, res) => {
  //res.send('Hello world API')
//})

app.get('/', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts);
})

app.post('/', async (req, res) => {
  //get the info send by user to our API endpoint
  const {message} = req.body.message;

  //use our mongoose model to create database entry
  const thought = new Thought({message, hearts});

  try{
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  }catch(err){
    console.log(err)
    res.status(400).json({message: 'could not save thought to Database', error:err.errors});
  }
})

app.post('/:thoughtId/like', async (req, res) => {
  const {thoughtId} = req.params;
  console.log(`POST /${thoughtId}/like`);

  try{
    await Thought.updateOne({_id : thoughtId}, {$inc:{'hearts' :1}})
    res.status(201).json({});
   
  }catch(err){
    console.log(err)
    res.status(400).json({message: 'could not save like to Database due to thought not found', error:err.errors});
  }
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
