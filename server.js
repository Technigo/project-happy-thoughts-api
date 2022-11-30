import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 140,
    trim: true
  },
  heart: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema)

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send({
    Message: "Welcome to my Happy Thoughts API",
    Routes: [{
      "/thoughts": "Send a GET request to see all thoughts, or POST request to create a new Happy Thought"
    }]
  });
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughtList = await Thought.find().sort({createdAt: "desc"}).limit(20).exec();
    res.status(200).json(thoughtList);
  } catch (error) {
    res.status(400).json({success: false, response: error})
  }
});

app.post("/thoughts", async (req, res) => {
  const {message} = req.body;
  try {
    const newThought = await new Thought({message: message}).save();
    res.status(201).json({success: true, response: newThought})
  }catch (err){
    res.status(400).json({success: false, response: "Could not save message to the Database", error: err.errors})
  }
})

app.patch("/thoughts/:thoughtId/like", async (req, res) => {
   const {thoughtId} = req.params;
   try {
    const thoughtToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
    res.status(200).json({success: true, response: `Thought ${thoughtToUpdate.id} has their likes updated`});
   } catch (error) {
    res.status(400).json({success: false, response: "Thought id not found", error: error});
   }
});

////////////////
/* const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    // most important one
    type: String,
    // forces to provide this value
    required: true,
    // new name will have to be different than all others in the DB
    unique: true,
    // all the allowed values
    enum: ["Matilda", "Poya", "Petra", "Hanna", "Daniel"]
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 30,
    // removes unnecessary whitespaces
    trim: true
  },
  score: {
    type: Number,
    // initial value, if none other is specified
    default: 0
  },
  createdAt: {
    type: Date,
    // new Date() will execute once - when we start the server
    // default: new Date()
    // onClick = { someFunction()}
    // IIFE - in the moment that you declare the function it is called/executed right away
    // (() => new Date())()
    // (function functionName () {new Date()})()
    default: () => new Date()
  }
});

const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema); */

// V1
// app.post("/members", async (req, res) => {
//   const {name, description} = req.body;
//   console.log(req.body);
//   try {
//     const newMember = await new TechnigoMember({name: name, description: description}).save();
//     res.status(201).json({success: true, response: newMember});
//   } catch(error) {
//     res.status(400).json({success: false, response: error});
//   }
// });



// V2 POST with promises
// app.post("/members", (req, res) => {
//  const {name, description} = req.body;
//  const newMember = new TechnigoMember({name: name, description: description}).save()
//    .then(data => {
//    res.status(201).json({success: true, response: data});
//  }).catch(error => {
//  res.status(400).json({success: false, response: error});
//  });
//});

// V3 POST mongoose syntax
// app.post("/members", (req, res) => {
//   const {name, description} = req.body;
//     const newMember = new TechnigoMember({name: name, description: description}).save((error, data) => {
//       if(error) {
//         res.status(400).json({success: false, response: error});
//       } else {
//         res.status(201).json({success: true, response: data});
//       } 
//     });
// });

// POST => create stuff
// PUT => replace in DB -> one PErson switch with another
// PATCH => change/modify stuff
/* app.patch("/members/:id/score", async (req, res) => {
   const { id } = req.params;
   try {
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}});
    res.status(200).json({success: true, response: `Member ${memberToUpdate.name} has their score updated`});
   } catch (error) {
    res.status(400).json({success: false, response: error});
   }
}); */
///////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
