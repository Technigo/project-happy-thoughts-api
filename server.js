import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-Happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Thought "Schema" defines the structer of how the thoughts in the frontend is handled

const ThoughtSchema = new mongoose.Schema({
 message: {
    type: String,
    required: true,
    unique: true,
    minlength:1,
    trim: true
  },
  hearth: {
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

app.get("/", (req, res) => {
  "Hello, this is a backend built for: https://dynamic-puffpuff-f7c490.netlify.app/"
  res.send([
    {"Hello":  "This is a backend built for: https://dynamic-puffpuff-f7c490.netlify.app/"},
    {"/": "start page for backend api : https://project-happy-thoughts-api-nczig4g6cq-lz.a.run.app/"},
    {"/thoughts": "Displays the latest 20 thoughts. Example: https://project-happy-thoughts-api-nczig4g6cq-lz.a.run.app/thoughts"},
    {"/thoughts/:id/hearth": "creates a route where the user where we store how many likes the thought, ex: https://project-happy-thoughts-api-nczig4g6cq-lz.a.run.app/63863c0713c6c039df9e3b22/hearth"},
  ]);
});

// Route where a the latest 20 thoughts is shown.

app.get("/thoughts", async (req, res) => {
  const thought = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thought);
})

// Route where a new thought is created, which is stored in the backend

app.post("/thoughts", async (req, res) => {
  const {message, createdAt} = req.body;

  try {
    const newThought = await new Thought({message: message, createdAt: createdAt}).save();
    res.status(201).json({success: true, response: newThought});
  }catch (error){
    res.status(400).json({success: false, response: error});
  }
});

// Route where we add +1 to hearth (like) on a thought

app.patch("/thoughts/:id/hearth", async (req, res) => {
const { id } = req.params; // *deconstucting*
try {
  const hearthToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {hearth: 1}}) // ***when in doubt use this :) for this week  (according to Daniel)    !!!!!!!!!
  res.status(200).json({success: true, response: `Thought ${hearthToUpdate.name} has their likes updated`})
} catch (error) {
  res.status(400).json({success: false, response: error})
}
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
