import express, {response} from "express";
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


// V2 HappyThought model
const Thought = mongoose.model("Thought", {
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

// GET all Thoughts
app.get("/thoughts", async (req, res) => {
 const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()

 if (thoughts) {
  res.status(200).json(thoughts)
 } else {
  res.status(404).json({
    message: 'Could not find thoughts', error: err.errors
  })
 }
})

 //POST new thought, Version 1
app.post("/thoughts", async (req, res) => {
  //const thought = new Thought(req.body)
  const {message} = req.body;
  console.log(req.body);

 try {
   const savedThought = await new Thought({message}).save();
   res.status(201).json({
     success: true, 
     response: savedThought});
 } catch (error) {
    res.status(400).json
    ({ success: false, 
      message: 'Could not save this thought message', errors: err.errors
   });
 } 
})



//will do this in 3 different versions
//const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema); //(name, objectname)
//now start post request
//async = express
// POST request is hard to look at in browser, use postman or a function, in postmkan use raw // we want the POST, browser on default only handle GET
// version 1, if only want to make it one way,  async aproah id the best on the backend

//VERSION 1 - most universal
// app.post("/members", async (req, res) => {
// const {name, description} = req.body;
// console.log(req.body);
// try {
//   const newMember = await new TechnigoMember({name: name, description: description}).save();
//   res.status(201).json({success: true, response: newMember});
//   // status means created from backednd
//   // for frontend to know backend rqp went well creating user
//   // if user in frontend did notget suceesfull req - put error
// } catch (error) {
//   res.status(400).json({success: false, response: error}); 
// }
// })

// no loading here
//VERSION 2 handle with promises
// app.post("/members", async (req, res) => {
//   const {name, description} = req.body;

//     const newMember = await new TechnigoMember({name: name, description: description}).save() 
//     .then (data => {
//         res.status(201).json({success: true, response: data})
//     }).catch(error => {
//         res.status(400).json({success: false, response: error})
//      });
//     });
 

// dont have to call newmember here, its already saved
// + function in save, cobilt function
//VERSION 3 POST - mongose syntax
// app.post("/members", (req, res) => {
// const {name, description} = req.body; 

//   const newMember = new TechnigoMember({name: name, description: description}).save((error, data) => {
//     if(error) {
//       res.status(400).json({success: false, response: error})
//     } else {
//       res.status(201).json({success: true, response: data})
//     }
//    });
// });


app.patch("thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thoughtToBeUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
    res.status(200).json({
      success: true,
      response: `Thought ${thoughtToBeUpdate.hearts} its heart updated`});
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error});
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//POST => create stuff
// PUT => replace something in database -> replace in DB -> one Person switch with another
// PATCH => change/modify one thing, stuff
