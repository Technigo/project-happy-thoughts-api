import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happythoughts";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = Promise;

// Defines the port the app will run on
const port = process.env.PORT || 8000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Bad JSON format",
      message: "The request contains malformed JSON.",
    });
  }
  next();
});

//Model
const { Schema, model } = mongoose;
const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hearts: {
    type: Number,
    default: 0,
  },
});

const Thought = model("Thought", thoughtSchema);

// Routes
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.send(endpoints);
});

// Get all thoughts
app.get("/thoughts", async (req, res) => {
  const allThoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();

  if (allThoughts.length > 0) {
    res.json(allThoughts);
  } else {
    res.status(404).send("No thoughts was found");
  }
});
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  // Input Validation
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(422).json({
      success: false,
      error: "Invalid input",
      message: "Message is required and must be a non-empty string.",
    });
  }

  try {
    const thought = new Thought({ message });
    await thought.save();
    res.status(201).json({
      success: true,
      thought,
      message: "Thought created and saved",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Handle Mongoose schema validation error
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: "Validation error",
        message: messages.join(". "),
      });
    }

    // Handle other errors that could occur
    console.error("Failed to save thought:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Couldn't save new thought due to server error",
    });
  }
});

app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true, runValidators: true }
    );

    if (!thought) {
      return res.status(404).json({
        success: false,
        error: "NotFound",
        message: "Thought not found",
      });
    }

    res.status(200).json({
      success: true,
      thought,
      message: "Heart incremented successfully",
    });
  } catch (error) {
    console.error("Error incrementing heart:", error);
    if (error.name === "CastError") {
      res.status(400).json({
        success: false,
        error: "BadRequest",
        message: "Invalid thought ID format",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "InternalServerError",
        message: "Internal server error when attempting to increment heart",
      });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
