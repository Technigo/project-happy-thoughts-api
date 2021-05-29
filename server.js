import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from 'crypto'
import bycrypt from 'bcrypt'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const paginate = require('express-paginate')
const app = express();

// to create users 
const User= mongoose.model('Users',{
  email: {
    type: String,
    required: true,
    unique: true
  },
  username:{
    type: String,
    unique: true
  },
  password:{
    type: String,
    required:true
  },
  accessToken:{
    type: String,
    default: ()=> crypto.randomBytes(128).toString('hex')
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

const authenticateUser = async (req, res, next)=>{
  const accessToken = req.header('Authorization')

  try {
    const user = await User.findOne({ accessToken })
    if (user) {
      next()
    }else{
    res.status(401).json({message: 'Not authenticated',error})
      
    }
  } catch (error) {
    res.status(400).json({message:'Invalid request',error})
  }
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(paginate.middleware(20, 50))

// Get  all Thoughts
app.get("/", authenticateUser)
app.get("/", async (req, res) => {

  try{
    const allThoughts = await Thought.find().limit(req.query.limit).sort({createDate: -1})
    res.json(allThoughts)
  }catch(error){
    res.status(400).json({message:'Invalid request',error})
  }
});

//Create user
app.post("/user/create", async (req, res)=>{
  const { email, username, password} = req.body
  try {
    const salt = bycrypt.genSaltSync()

    const newUser = await new User({
      email,
      username,
      password: bycrypt.hashSync(password, salt)
    }).save()

    res.json({
      userId: newUser._id,
      username: newUser.username,
      accessToken: newUser.accessToken
    })  
  } catch (error) {
    res.status(400).json({message:'Invalid request',error})
  }
})

app.post('/signin', async (req, res)=>{
  const { username, password }= req.body

  try {
    const user = await User.findOne({username})

    if (user && bycrypt.compareSync(password, user.password)) {
      res.json({
        userId: user._id,
        username: user.username,
        accessToken: user.accessToken
      })  
    }else{
      res.status(400).json({message:'User no found',error})
    }
  } catch (error) {
    res.status(400).json(error)
    
  }
})

// Post a new Thought
app.post("/thoughts", authenticateUser)
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
