import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    Welcome: "Happy Thoughts API"
  });
});


const ThoughtSchema = new mongoose.Schema ({
  message: {
    type: String, 
    required: true,  
    unique: true,
    minlength: 4,
    maxlength: 30,
    trim: true,
    },
  hearts: {
    type: Number, 
    default: 0
  },
  createdAt: {
    type: Date, 
    default: () => new Date() 
  }
}); 

const Thought = mongoose.model("Thought", ThoughtSchema)

// Show thoguhts already posted 
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find({})
      .sort({ createdAt: -1 }).limit(20).exec()
    res.status(200).json({ success: true, response: thoughts });
  } catch (error) {
    res.status(400).json({ success: false, response: "Error, couldn't load thoughts"  });
  }
});


// Add the new thoguhts to the feed. 
app.post("/thoughts", async (req, res) => {
  const {name, description} = req.body; 
  console.log(req.body);
  try {
    const newThought = await new Thought({message: message}).save();
    res.status(201).json({sucess: true, response: newThought});
  } catch (error) {
    res.status(400).json({sucess: false, response: error});
  }
});

// Update hearts & likes
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { id } = req.params; 
  try {
  const thoughtToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {score: 1}}); 
  res.status(200).json({suncess: true, response: `Member ${thoughtToUpdate.name} score has updated`})
  }
 catch (error) {
  res.status(400).json({sucess: false, response: error});
}

});


////////

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
