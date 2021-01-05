import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Model for each message object
const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 140,
  },
  hearts: {
    type: Number,
    default: () => 0,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

const documentation = {
  "Welcome": "Welcome to Claire's Happy Thoughts API 🌼",
  "GET endpoint": {
    "https://claireshappythoughts.herokuapp.com/thoughts": "Use this endpoint in your application to show up to 20 of the most recent thoughts posted",    
  },  
  "POST endpoint": {
    "https://claireshappythoughts.herokuapp.com/thoughts": "Use this endpoint in your application to allow for the user to post to the api a thought. Only allows for the message to be sent in the body of the post request.",
  },
  "POST endpoint": {
    "https://claireshappythoughts.herokuapp.com/thoughts/:thoughtId/like": " Use this endpoint to allow for users to like thoughts by including the thought id in the url which targets the thought with that specific id and then updates the heart count.",
  },
};

app.get('/', (req, res) => {
  res.json("Welcome to the Happy Thoughts API!", documentation);
});

// thoughts get route which will show a max of 20 thoughts, sorted by createdAt to show the most recent 20 thoughts first 
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20);
  // returning a good status code and the json object that we saved to the database
  res.status(200).json(thoughts);
});

// thoughts post route which will be used to post new thoughts to the database
app.post('/thoughts', async (req, res) => {
  // Try catch form, but you can also use promises (then with a catch). This will try to save the new thought and if it doesn't succeed, for instance if it doesn't meet the min and maxlength defined in the model, then the error will be shown.
  try {
    // create new thought with the data passed via the body of the post request from the client side via the API endpoint and then save that to the database. Only the message can be updated and not the whole object as message is the only property specified and saved to the database
    const thought = await new Thought({message: req.body.message}).save();
    // returning a good status code and the json object that we saved to the database
    res.status(200).json(thought);
  } catch (error) {
    // returning a bad error code and a message with some more information to the user as to why the thought wasn't sent.
    res.status(404).json({message: "Could not save new thought to the database. Please make sure that you've entered a valid thought that is between 5-140 letters long.", errors:error.errors})
  }
});

// thoughts put route that targets a specific thought id when queried in the API endpoint. Then updateOne mongoose function is used update the hearts property for the thought with the id requested. 
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    await Thought.updateOne({ _id: thoughtId}, {$inc: {hearts: +1}});
    res.status(201).json({message:"You're thought has been liked"}); 
  }  catch (error) {
    res.status(404).json({message: "That thought id is not valid. Please enter a valid thought id."})
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
