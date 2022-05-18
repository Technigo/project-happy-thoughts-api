import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8090;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//can create this for properties always present on the page
const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    //only accepted names
    enum:["Karin", "Petra", "Matilda", "Poya", "Daniel"]
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 30,
    //delets blankspace fro beginning and end of string
    trim: true
  },
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    //need to be anonymous function, otherwise would only be excecuted once
    // now called every time new member is created
    default: ()=> new Date()
  }
})

const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema)

// app.post("/members", async (req, res) => {
//   const { name, description } = req.body
//   console.log(req.body)
//   //why save new member to a var? RESTful:send back the data we create, we are not only sending back name & descr
//   //but whole object, so the id is sent back, and if we want member details need only send id
//   try {
//     const newMember = await new TechnigoMember({name: name, description: description}).save()

//   res.status(201).json({response: newMember, success: true})

//   } catch (error) {
//     res.status(400).json({response: error, success: false})

//   }

// })

//POST with promises
app.post("/members", (req, res) => {

  const { name, description } = req.body
  console.log(req.body)

  new TechnigoMember({name: name, description: description}).save()
  .then(data => {
  res.status(201).json({response: data, success: true})

  }).catch(error => {
    res.status(400).json({response: error, success: false})
  })
  })


// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
