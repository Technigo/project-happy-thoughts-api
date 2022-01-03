import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    trim: true,
    maxlength: 140,
    minlength: 5,
    required: true,
  },
  hearts: { type: Number, default: 0 },
  createdAt: { type: Number, default: () => Date.now() },
});
const Thought = mongoose.model("Thought", ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const newMessage = await new Thought({ message }).save();
    res.status(201).json({ response: newMessage, success: true });
  } catch (error) {
    res.status(404).json({ response: error, success: false });
  }
});
app.post("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const addLike = await Thought.findByIdAndUpdate(
      id,
      {
        $inc: {
          hearts: 1,
        },
      },
      { new: true }
    );
    res.status(200).json({ response: addLike, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
