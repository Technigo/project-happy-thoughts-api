import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from 'express-list-endpoints';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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


// MY mongoose schema
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true    
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema)


//Routes
app.get("/", (req, res) => {
  res.send("Hello Happy Thoughts! https://cute-hummingbird-6688bb.netlify.app/");
  res.send(listEndpoints(app))
})

//show thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec()
    res.status(200).json(thoughts)
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})

//add thought
app.post("/thoughts", async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought({message: message}).save()
    res.status(201).json({response: newThought, success: true})
  } catch(error) {
    res.status(400).json({response: error, success: false})
  }
})

//likes
app.post("/thoughts/:id/likes", async (req, res) => {
  const { id } = req.params
  try {
    const updateLikes = await Thought.findByIdAndUpdate(id, {$inc: {score: 1}})
    res. status(200).json(updateLikes)
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});






// -------- mongoose schema from monday lecture
// const TechnigoMemberSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     unique: true,
//     enum: ["Karin", "Petra", "Matilda", "Poya", "Daniel"]
//   },
//   descprition: {
//     type: String,
//     minlength: 4,
//     maxlength: 30,
//     trim: true
//   },
//   score: {
//     type: Number,
//     default: 0
//   },
//   createdAt: {
//     type: Date,
//     default: ()=> new Date()
//   }
// })

// const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema)



// ----- POST request V1
// app.post("/members", async (req, res) => {

//   const { name, descprition } = req.body;
//   console.log(req.body)
//   try {
//     const newMember = new TechnigoMember({name: name, descprition: descprition}).save()

//     res.status(201).json({response: newMember, success: true})
//   } catch(error) {

//     res.status(400).json({response: error, success: false})
//   }
// })

// ----- POST request with promises V2

// app.post("/members", (req, res) => {

//   const { name, descprition } = req.body;
//   console.log(req.body)

// new TechnigoMember({name: name, descprition: descprition}).save()
//   .then(data => {
//     res.status(201).json({response: data, success: true})
//   }).catch(error => {
//     res.status(400).json({response: error, success: false})
//   })
// })

// ----- POST request with callback (Mongoos specific) V3
// app.post("/members", (req, res) => {

//   const { name, descprition } = req.body;

// new TechnigoMember({name: name, descprition: descprition}).save((error, data) => {
//   if (error) {
//     res.status(400).json({response: error, success: false})
//   } else {
//     res.status(201).json({response: data, success: true})
//   }
//   })
// })

// POST -> creating
// PUT -> replaces
// PATCH -> changes

// app.post("/members/:id/score", async (req, res) => {
//   const { id } = req.params
//   try {
//     const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}})
//     res.status(200).json({response: `Member ${memberToUpdate.name} has been updated` , success: true})
//   } catch (error) {
//     res.status(400).json({response: error, success: false})
//   }
// })





