import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const paginate = require('express-paginate')
const app = express();

// to create users 
const User= mongoose.model('Users',{
  username:{
    type: String,
    lowercase: true,
    unique: true
  }
})

//to create Thoughts 
const Thought = mongoose.model("Thoughts", {
  message: {
    type: String,
    required: true,
    minLength: 5,
    maxLength:140
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  username:{
    type: String,
    ref: User,
    required: true
  },
  hashtag:{
    type: Array,
    default: []
  }
});

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(paginate.middleware(20, 50))

// Get  all Thoughts
app.get("/", async (req, res) => {
  /* const pagination  = req.query.page
  console.log(pagination) */
  try{
    const allThoughts = await Thought.find().limit(req.query.limit).sort({createDate: -1})
    res.json(allThoughts)
  }catch(error){
    res.status(400).json(error)
  }
});

//Create user
app.post("/user/create", async (req, res)=>{
  try {
    const newUser = await new User({username: req.body.username}).save()
    res.json(newUser)  
  } catch (error) {
    res.status(400).json(error)
  }
})
//search users
app.get("/users", async (req, res)=>{
  try {
    const allUser= await User.find()
    res.json(allUser)
  } catch (error) {
    res.status(400).json(error)
  }
})

// Post a new Thought
app.post("/thoughts", async (req, res) => {

  const hashtag = []
  const stringToArray= req.body.message.trim().split(" ")

  stringToArray.forEach((word)=>{
    const isHashtag = word.startsWith('#')

    if (isHashtag) {
      hashtag.push(word)
    }
  })

  try {
    const findUser = await User.find({username: req.body.username})
    
    if(findUser.length){
      const newThought = await new Thought({message: req.body.message, username: req.body.username, hashtag: hashtag}).save();
      res.json(newThought);
    }else{
       res.status(400).json({message:"user no found"})
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

//Post Like 
app.post("/thoughts/:thoughtId/like", async (req, res)=>{
  const id = req.params.thoughtId
 
  try{
    const thoughtsId = await Thought.findById(id)
    await Thought.findByIdAndUpdate(id,{hearts:thoughtsId.hearts+1})
    const addLikeUpdated = await Thought.findById(id)
    res.json(addLikeUpdated);
    
  } catch(error){
    res.status(400).json(error);
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
