import express, { response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const mongoUrl = process.env.MONGO_URL 
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


const ThoughtSchema = new mongoose.Schema({ // allowing us to create a object, below the description/type
  message: {
    type: String, // type , madatory , most important
    minlength: 5,
    maxlength: 140,
    required: true, // providing a message mandatory  
    trim: true // taking all the necessary white space around content
  },
  hearts: { 
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,               // on default you can do logic with anonymous function on Schemas () =>
    default: () => new Date() // executing once we run the server. if you want to call it immediately,(for req info too): (()=> new Date)() or like this (function functiomessage () {new DAte()})()
  }
  })

  const Thought = mongoose.model("Thought", ThoughtSchema) // mongoose with ThoughtSchema

    // Start defining your routes here
  app.get("/", (req, res) => {
    res.send({
      Message: "This is an API for Happy Thoughts",
      Routes: [{
        "/thoughts": "POST / GET option for thought handling",
        "/thoughts/:thoughtsId/like" : " Update likes to a thought in the API"
        }]
      });
    });


  app.post("/thoughts", async (req, res) => {
    const { message, _id } = req.body // ex. "message": "Maria" => terminal gives output
    console.log(req.body)
    try {
      const newInput = await new Thought({ message: message, id : _id }).save()
      res.status(201).json({ success: true, response: newInput }) // 201 created success
    } catch (error) {
      res.status(400).json({ success: false, response: error })
    }
  })

  app.post("/thoughts/:thoughtId/like", async (req, res) => {
    const { thoughtId } = req.params
    console.log(thoughtId)
    try {
      const update = await new Thought.findByIdAndUpdate({thoughtId, $inc: {hearts: 1} })
      res.status(201).json({ success: true, response: update })
    } catch (error) {
      res.status(400).json({ suceess: false, response: error})
    }
  })

  app.get("/thoughts", async (req ,res) => { // http://localhost:8080/thoughts?page=2&perPage=1
    const { page, perPage } = req.query

    try {
      const thoughtsMembers = await Thought.find({}).sort({createdAt: -1}).limit(20)  //limiting till 20 first thoughts
      res.status(200).json({ success: true, response : thoughtsMembers })
    } catch (error) {
      res.status(400).json({ success: false, response: error })
    }
  })

  // Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

