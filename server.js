import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8090;
const app = express();

app.use(cors());
app.use(express.json());


const HappyThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0,
    //should not be assigned to new thought so not an anonomus function
  },
  createdAt: {
    type: Date,
    default: Date.now
    //should not be assigned to new thought so not an anonomus function
  }
})

//schema differs : only has properties, create those that are always present on the page
// model has functions like findbyID, save
const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    //type is most imortant and always needed
    type: String,
    required: true,
    //not three Daniels
    unique: true,
    //only accepted names, can be used for tags also like admin rights
    enum:["Karin", "Petra", "Matilda", "Poya", "Daniel"]
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 30,
    //delets blankspace from beginning, and end of string
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

const HappyThought = mongoose.model("HappyThought", HappyThoughtSchema)

// async await is the most used of the three POST requests
//happy thought message
app.post("/members", async (req, res) => {
  const { name, description } = req.body
  console.log(req.body)
  //why save new member to a var? RESTful:send back the data we create, we are not only sending back name & descr
  //but whole object, so the id is sent back, and if we want member details need only send id
  try {
    const newMember = await new TechnigoMember({name: name, description: description}).save()

  res.status(201).json({response: newMember, success: true})

  } catch (error) {
    res.status(400).json({response: error, success: false})

  }
})

//POST - creating (can be used for all)
//PUT - replace all object
//PATCH - replace property in object

//happy thought like +1
app.post("/members/:id/score", async (req, res) => {
  const { id } = req.params
try {
  const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}})
  res.status(200).json({response: `Member ${memberToUpdate.name} has been updated`, success: true})
} catch (error) {
res.status(400).json({response: error, success: false})
}
})

//POST with promises, second most used
// app.post("/members", (req, res) => {

//   const { name, description } = req.body
//   console.log(req.body)

//   new TechnigoMember({name: name, description: description}).save()
//   .then(data => {
//   res.status(201).json({response: data, success: true})

//   }).catch(error => {
//     res.status(400).json({response: error, success: false})
//   })
//   })

  //mogoose specific, can't be used otherwise
// app.post("/members", (req, res) => {

//   const { name, description } = req.body  

//   new TechnigoMember({name: name, description: description}).save((error, data) => {
//     if (error) {
//       res.status(400).json({response: error, success: false})
//     } else {
//       res.status(201).json({response: data, success: true})
//       }
//     })
//   })
  

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
