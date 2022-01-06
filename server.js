import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
});

const Thought = mongoose.model("Thoughts", ThoughtSchema);

app.use(cors());
app.use(express.json());

app.get("/thoughts", async (req, res) => {
  const {
    sort,
    page,
    perPage,
    sortNum = Number(sort),
    pageNum = Number(page),
    perPageNum = Number(perPage),
  } = req.query;

  // v1 mongoose
  // const thoughts = await Thought.find({})
  //   .sort({ createdAt: sortNum })
  //   .skip((pageNum - 1) * perPageNum)
  //   .limit(perPageNum);

  // v2 mongo
  const thoughts = await Thought.aggregate([
    {
      $sort: {
        createdAt: sortNum,
      },
    },
    {
      $skip: (pageNum - 1) * perPageNum,
    },
    {
      $limit: perPageNum,
    },
  ]);

  res.status(200).json({ response: thoughts, success: true });
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.post("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedHearts = await Thought.findByIdAndUpdate(
      id,
      {
        $inc: {
          hearts: 1,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ response: updatedHearts, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
