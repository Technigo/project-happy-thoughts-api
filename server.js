import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongoMongo";
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

const HappyThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    // anonumys function calls date every time a post is created
    // default: () => new Date(),
    default: Date.now,
  },
});

const HappyThought = mongoose.model("HappyThought", HappyThoughtSchema);

app.post("/message", async (req, res) => {
  const { message } = req.body;

  try {
    const newMessage = await new HappyThought({
      message: message,
    }).save();
    res.status(200).json({ response: newMessage, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

app.post("/message/:id/likes", async (req, res) => {
  const { id } = req.params;
  try {
    const messageToUpdate = await HappyThought.findByIdAndUpdate(id, {
      $inc: { likes: 1 },
    });
    res.status(200).json({
      respons: `Message '${messageToUpdate.message}' has been updated`,
      success: true,
    });
  } catch (error) {
    res.status(400).json({ respons: error, success: false });
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
