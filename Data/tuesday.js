import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";

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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});
////////////////
const TechnigoMemberSchema = new mongoose.Schema({
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
    default: () => new Date
  }
});

const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema);

// V1 - MOST PREFERED
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
app.post("/members", (req, res) => {
  const {name, description} = req.body;
    const newMember = new TechnigoMember({name: name, description: description}).save()
      .then(data => {
        res.status(201).json({success: true, response: data});
    }).catch(error => {
        res.status(400).json({success: false, response: error});
    });
});

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
app.patch("/members/:id/score", async (req, res) => {
   const { id } = req.params;
   try {
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}});
    res.status(200).json({success: true, response: `Member ${memberToUpdate.name} has their score updated`});
   } catch (error) {
    res.status(400).json({success: false, response: error});
   }
});
///////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
