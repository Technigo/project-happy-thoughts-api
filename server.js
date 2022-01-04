import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true,
});
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// scheema : name. description etc
// This way, when you are going to reuse your schema
// Enum = only allowed values
const ThoughtSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  like: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
});
//Mongoose model with Schema
const Thought = mongoose.model("Thought", ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Cowabunga");
});

//Endpoint that return thoughts in descending order
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.status(201).json({ response: thoughts, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.post("/thoughts", async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save();
    res.status(201).json({ response: savedThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Post method for adding likes/hearts
app.post("/thoughts/:id/likes", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      id,
      {
        $inc: { likes: 1 },
      },
      { new: true }
    );
    res.status(200).json({ response: updatedThought, succes: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
