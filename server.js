import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

//schema
const thoughtSchema = mongoose.Schema({
  message: {
    type: String,
    required: [true, "Ops, you forgot to write a message"],
    minlength: [5, "Try again, the messages needs to be at least five characters long"],
    maxlength: [140, "Try again, the messages needs to be less than 140 characters"],
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now, // can be written like () => Date.now()
  },
});

//model
const Thought = mongoose.model("Thought", thoughtSchema);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

// post request
app.post("/thoughts", async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save();
    res.json(newThought);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
