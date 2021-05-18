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

const thoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Message is required"],
    unique: true,
    validate: {
      validator: (value) => {
        return /^[^0-9]+$/.test(value);
      },
      message: "Numbers are not allowed",
    },
    minlength: 4,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Thought = mongoose.model("Thought", thoughtSchema);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("/thoughts", async (req, res) => {
  try {
    const newThought = await new Thought(req.body).save();
    res.json(newThought);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ error: "Duplicated value", fields: error.keyValue });
    }
    res.status(400).json(error);
  }
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
