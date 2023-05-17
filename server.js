import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-happy-thought-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining routes here
app.get("/", (req, res) => {
  res.send("Happy Thoughts API - Joanna Philips");
});

const { Schema } = mongoose;
const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  hearts: {
    type: Number,
    default: 0
  },
  username: {
    type: String,
    default: "Anonymous",
    minlength: 2,
    maxlength: 20,
    // an array of all the allowed values
    // enum:["fruit", "vegetable"]
  },
  tags: {
    type: String,
    default: "random",
    enum:["weather", "work", "life", "happy"]
  }
}); 

const Thought = mongoose.model("Thought", ThoughtSchema);

app.get("/thoughts", async (req, res) => {
  try {
    const thoughtsList = await Thought.find().sort({ createdAt: "desc" }).limit(20);
    res.status(200).json({
      success: true,
      response: thoughtsList,
      message: "Thoughts found successfully"
     });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Thoughts not found"
     });
  }
});

app.post("/thoughts", async (req, res)=>{
  const {message} = req.body;
    try{
      const thoughtItem = await new Thought({message}).save();
      res.status(201).json({
       success: true,
        response: thoughtItem,
        message: "Thought posted successfully"
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        response: e,
        message: "Thought posting failed"
       });
     }
 });


app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const likedThought = await Thought.findByIdAndUpdate(thoughtId, {
      $inc: { hearts: 1},
    });
    res.status(200).json({
      success: true,
      response: likedThought,
      message: "Like added"
     });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Like not added"
     });
  }
});

// delete
// https://stackoverflow.com/questions/54081114/what-is-the-difference-between-findbyidandremove-and-findbyidanddelete-in-mongoo
// app.delete("/fruit_or_vegetable/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     // const foodItem = await FruitOrVegetable.findByIdAndDelete(id);
//     const foodItem = await FruitOrVegetable.findByIdAndRemove(id);
//     res.status(200).json({
//       success: true,
//       response: foodItem,
//       message: "deleted successfully"
//      });
//   } catch(e) {
//     res.status(400).json({
//       success: false,
//       response: e,
//       message: "did not successfully"
//      });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
