import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8090;
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
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createAt: {
    type: Date,
    default: () => new Date(),
  },
});

const HappyThoughts = mongoose.model("HappyThoughts", HappyThoughtsSchema);

// Start defining your routes here

app.get("/", (req, res) => {
  const Landing = {
    Welcome: "Happy Thoughts - API",
    View: "Happy Thoughts project has been updated, see API live https://happy-thougts.netlify.app/",
    Routes: [
      {
        "All endpoints are listed here": "/thoughts",
      },
    ],
  };
  res.send(Landing);
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await HappyThoughts.find().sort({ createdAt: "desc" });
    res.status(200).json(thoughts);
  } catch (err) {
    res.status(400).json({
      message: "Could not get thoughts",
      error: err.errors,
      success: false,
    });
  }
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newHappyThought = await new HappyThoughts({ message }).save();
    res.status(200).json(newHappyThought);
  } catch (err) {
    res.status(400).json({
      message: "Could not save the Happy Thoughts",
      error: err.errors,
      success: false,
    });
  }
});
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const likedThought = await HappyThoughts.findByIdAndUpdate(thoughtId, {
      $inc: { hearts: 1 },
    });
    res.status(200).json(likedThought);
  } catch (err) {
    res.status(400).json({
      message: "Could not find and update this post",
      error: err.errors,
      success: false,
    });
  }
});

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({
      error: "Service unavailable",
    });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
