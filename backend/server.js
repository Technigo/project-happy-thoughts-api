import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();
const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughtAPI";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = Promise;

const Thought = mongoose.model("Thought", {
  message: String,
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/thoughts");
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find();
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message }).save();

    res.json(newThought);
  } catch (error) {
    res.status(400).json({ message: "Invalid request", error });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
