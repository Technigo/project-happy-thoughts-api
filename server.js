import express from "express";
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

//Schema allows us to reuse code
//We can combine a schema for certain propertys that shall remain together with properties that shall vary
const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    //enum will add the only acceptable names to be able to pass to the name property
    enum:["Karin", "Petra", "Matilda", "Poya", "Daniel"]
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 30,
    //deletes whitespace from beginning and end of string - not in between
    trim: true
  },
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    //anonymus function in order not to execute new Date function at once 
    default: () => new Date()
  }
});

//Mongoose model allows of to use the methods like findings
const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema);

//POST request with async await - version 1
app.post("/members", async (req, res) => {
 
  const { name, description } = req.body;
  console.log(req.body);
  try {
    const newMember =  await new TechnigoMember({name: name, description: description}).save();

    res.status(201).json({response: newMember, success: true})
  } catch(error) {

    res.status(400).json({response: error, success: false});
  }
});

//POST with promises - version 2
// app.post("/members", (req, res) => {
 
//   const { name, description } = req.body;
//   console.log(req.body);

//     new TechnigoMember({name: name, description: description}).save()
//      .then(data => {
//       res.status(201).json({response: data, success: true});
//      }).catch(error => {
//       res.status(400).json({response: error, success: false});
//      })
// });

app.post("/members/:id/score", async (req, res) => {
  const { id } = req.params;
  try {
    //score updated first after the find is made therfor not visible in response
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}});
    res.status(200).json({response: `Member ${memberToUpdate.name} has been updated`, success: true});
  } catch (error) {
    res.status(400).json({response: error, success: false});
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

