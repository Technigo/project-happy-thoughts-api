import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-happy-thoughts-api";
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

const { Schema } = mongoose;

const HappyThoughtsSchema = new Schema({
  text: {
    type:String,
    required: true,
    minlength: 4,
    maxlength: 140
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 140
  }
})

const HappyToughts = mongoose.model("HappyThoughts", HappyThoughtsSchema)

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello from Nina!");
});

app.get('/thoughts', async (req, res) => {
  const thoughts = await HappyToughts.find().sort({createdAt: 'desc'}).limit(20).exec();
  res.json(thoughts)
  });
app.post('/thoughts', async (req, res) => {
  const { text, description } = req.body;
  const thought = new HappyToughts({ text, description });

  try{
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err){
    console.error(err);
    res.status(400).json({message: 'Could not save thought', error:err.errors})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
