import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
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
  res.send("Happy thoughts!");
});
////// Tuesday ////

const { Schema } = mongoose;
const ThoughtSchema = new Schema({
  message: {
    // most important one
    type: String,
    // required true or false
    required: true,
    maxlength: 140,
    minlength: 5,
    trim: true // removes unnecessary whitespaces from string
    
  },
  likes: {
    type: Number,
    default: 0
    
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  
}); 

const Thought = mongoose.model("Thought", ThoughtSchema);

////////////GET-REQUEST/////////
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec()
  try {  
    res.status(200).json({
      success: true,
      response: thoughts, 
      message: "sucessful get request"
    })
  } catch (e) {
    res.status(400).json({
      success: false, 
      response: e,
      message: "Bad request",
    })
  }
})

//////////POST REQUEST/////////
app.post("/thoughts", async (req, res) => {
  const {message, createdAt} = req.body;
    try{
      // const foodItem = await new FruitOrVegetable({kind: kind, name: name, description: description})
      const savedThought = await new Thought({message: message, createdAt: createdAt}).save();
      res.status(201).json({
       success: true,
        response: savedThought,
        message: "created thought successfully"
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        response: e,
        message: "not thoughts?"
      });
    }
});



////////////POST////////////////
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params
  try{
    const updateLikes = await Thought.findByIdAndUpdate(thoughtId, {$inc: {likes: 1 } })
    res.status(201).json({
      success: true,
      response: `Happy thought: ${updateLikes.message} has been updated`
    })
  } catch (e) {
    res.status(400).json({
      success: false, 
      response: e,
      message: "Could not save like to database!"
    })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
