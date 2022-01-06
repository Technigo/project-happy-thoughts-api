import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

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
  category: {
    type: String,
    enum: ["food", "hobby", "poetry", "politic", "other"],
    default: "other",
  },
  writer: { type: String, default: "anonymous" },
  hearts: { type: Number, default: 0 },
  createdAt: { type: Number, default: Date.now },
});
const Thought = mongoose.model("Thought", ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/thoughts", async (req, res) => {
  const {
    oldest,
    all,
    writer,
    page,
    perPage,
    pageNum = Number(page),
    perPageNum = Number(perPage),
  } = req.query;
  let thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .skip((pageNum - 1) * perPageNum)
    .limit(perPageNum);
  if (oldest) {
    thoughts = await Thought.find().sort({ createdAt: "asc" }).limit(20);
  }
  if (all) {
    thoughts = await Thought.find().sort({ createdAt: "desc" });
  }
  if (writer) {
    thoughts = await Thought.find({
      writer: { $regex: writer },
    });
  }

  if (thoughts) {
    res.json(thoughts);
  }
});

app.get("/thoughts/category/:category", async (req, res) => {
  const { category } = req.params;
  let thoughts = await Thought.find({
    category: { $regex: category },
  });
  res.json(thoughts);
});
app.post("/thoughts", async (req, res) => {
  const { message, writer, category } = req.body;
  try {
    const newMessage = await new Thought({ message, writer, category }).save();

    res.status(200).json({ response: newMessage, success: true });
  } catch (err) {
    res.status(400).json({
      response: "Can not create thought",
      errors: err.errors,
      success: false,
    });
  }
});
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const addLike = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: {
          hearts: 1,
        },
      },
      { new: true }
    );
    if (addLike) {
      res.status(200).json({ response: addLike, success: true });
    } else {
      res.status(404).json({ response: "invalid id", success: false });
    }
  } catch (err) {
    res.status(400).json({
      response: "can´t find a thought with this id",
      errors: err.errors,
      success: false,
    });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
