import express from "express";
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

const HappyThoughtsSchema = new mongoose.Schema({
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

const HappyThoughts = mongoose.model("HappyThoughts", HappyThoughtsSchema)

// Add the endpoints here later on
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/thoughts", async (req,res) => {
  try {
    const thoughts = await HappyThoughts.find().sort({createdAt: "desc"})
    res.status(200).json(thoughts)
  } catch (err) {
    res.status(400).json({
      message: "Could not get thoughts",
      error: err.errors,
      success: false
    })
  }
})

app.post("/thoughts", async (req, res) => {
  const { message } = req.body

  try {
    const newHappyThought = await new HappyThoughts({message}).save()
    res.status(200).json(newHappyThought)
  } catch (err) {
    res.status(400).json({
      message: "Could not save the Happy Thought",
      error: err.errors, 
      success: false
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
