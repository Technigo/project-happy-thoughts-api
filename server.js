import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/happy-happy-thoughts";
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
  res.send("Happy Thoughts!");
});


// Following Tuesday's session

const { Schema } = mongoose;
const ThoughtsSchema = new Schema({
  message: {
    // most important is the type
    type: String,
    // required will be true or false
    required: true,
    // unique is regarding the uniqueness of the value compared what is already in the DB
    unique: false,
    minlength: 4,
    maxlength: 150,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  }, 
  createdAt: {
    type: Date,
    default: new Date()
  },
  mood: {
    type: String,
    required: false,
    // enum is an array of all the allowed values
    enum:["happy", "happier", "happiest"]
  }
});

const Thought = mongoose.model("Thought", ThoughtsSchema);

// This time it will be a post request

// app.post("/fruit_or_vegetable", async (req, res)=>{
//   const {kind, name, description} = req.body;
//    try{
//     const foodItem = await new FruitOrVegetable({kind: kind, name: name, description: description}).save();
//     res.status(201).json({
//       success: true,
//       response: foodItem,
//       message: "Created successfully"
//     });
//    } catch (e) {
//     res.status(400).json({
//       success: false,
//       response: e,
//       message: "Error"
//     });
//    }
// });

app.get("/thoughts", async (req, res)=>{
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts)
});

app.post("/thoughts", async(req, res) => {
  const {message, createdAt, mood} = req.body;
  try{
    const savedThought = await new Thought({message: message, createdAt: createdAt, mood: mood}).save();
    res.status(201).json({success: true, response: savedThought});
  }catch (err){
    res.status(400).json({success: false, message:'Failed to post a thought'})
  }
});


// Here is to try to do with JS promises, async is not needed. Async/await is more common

// app.post("/fruit_or_vegetable", (req, res)=>{
//   const {kind, name, description} = req.body;
//   const foodItem = new FruitOrVegetable({kind, name, description}).save()
//   .then(item => {
//     res.status(201).json({
//       success: true,
//       response: item,
//       message: "Created successfully"
//     });
//   }).catch (e => {
//     res.status(400).json({
//       success: false,
//       response: e,
//       message: "Error"
//     });
//   })
// });

// These are the 3 requests that are available to us to modify the data inside the DB

// POST : create new entries in the DB //create
// PATCH : to update specific properties of these entries //update
// PUT : Will replace the entry that we currently have //replace

app.patch("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const heartsUpdate = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}});
    res.status(200).json({
      success: true,
      // the response was "response: foodItem", but was changed to "{}" to not confuse the front-end part by what is being returned
      response: {},
      message: "Thought ${heartsUpdate.message} has their hearts updated"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Failed to update"
    });
  }
});

// After trying delete, we need to modify when nothing is found

// app.get("/fruit_or_vegetable/:id", async (req, res) => {
//   const { id } = req.params;
//   const { newDescription } = req.body;
//   try {
//     const foodItem = await FruitOrVegetable.findById(id)
//     res.status(200).json({
//       success: true,
//       // the response was "response: foodItem"
//       response: foodItem,
//       message: "found successfully"
//     });
//   } catch (e) {
//     res.status(400).json({
//       success: false,
//       response: e,
//       message: "Failed to update"
//     });
//   }
// });

// Delete request

// app.delete("/fruit_or_vegetable/:id", async (req, res) => {
//   const { id } = req.params;
//   const { newDescription } = req.body;
//   try {
//     const foodItem = await FruitOrVegetable.findByIdAndDelete(id);
//     res.status(200).json({
//       success: true,
//       // the response was "response: foodItem"
//       response: foodItem,
//       message: "deleted successfully"
//     });
//   } catch (e) {
//     res.status(400).json({
//       success: false,
//       response: e,
//       message: "Failed to delete"
//     });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
