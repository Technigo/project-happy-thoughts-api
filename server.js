import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtSchema = new mongoose.Schema({
  message: {
     type: String,
     required: true,
     unique: true,
     minlength:1,
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

const Thought = mongoose.model("Thought", ThoughtSchema);

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// 1st route: the main route.

app.get("/", (req, res) => {
  res.send([
    {"Hello!": "This is the backend built for: https://maria-wellanders-happy-thoughts.netlify.app/"}
  ]);
});

// 2nd route: route to retrieve the 20 latest thoughts in the feed.

app.get("/thoughts", async (req, res) => {
  const thought = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thought);
})

// 3rd route: route to create a new thought to the thought feed.

app.post("/thoughts", async (req, res) => {
  const {message, createdAt} = req.body;

  try {
    const newThought = await new Thought({message: message, createdAt: createdAt}).save();
    res.status(201).json({success: true, response: newThought});
  }catch (error){
    res.status(400).json({success: false, response: error});
  }
});

// 4th route: route to modify the number of heart-likes a thought gets.
// Updates the thought with +1 hearts when heart-liking the specific thought.

app.patch("/thoughts/:id/hearts", async (req, res) => {
const { id } = req.params;
try {
  const heartsToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}})
  res.status(200).json({success: true, response: `Thought ${heartsToUpdate.name} has their likes updated`})
} catch (error) {
  res.status(400).json({success: false, response: error})
}
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});