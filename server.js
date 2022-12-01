import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

const HappyThoughtSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
  },
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
    type: Date,
    default: () => new Date(),
  },
});

const HappyThought = mongoose.model("HappyThought", HappyThoughtSchema);

// GET messages from database, display only 20 latest
app.get("/thoughts", async (req, res) => {
  try {
    const allThoughts = await HappyThought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.status(201).json({
      success: true,
      response: allThoughts,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
    });
  }
});

// POST messages
app.post("/thoughts", async (req, res) => {
  const { name, message } = req.body;

  try {
    const newThought = await new HappyThought({
      name: name,
      message: message,
    }).save();
    res.status(201).json({
      success: true,
      response: newThought,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Could not post new message",
      response: error,
    });
  }
});

// PATCH Update likes <3
app.patch("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  const thoughtToUpdate = await HappyThought.findByIdAndUpdate(id, {
    $inc: { hearts: 1 },
  });
  try {
    res.status(200).json({
      success: true,
      response: `Message '${thoughtToUpdate.message}' got liked`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
    });
  }
});

// DELETE removes entry and returns the removed one
app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedThought = await HappyThought.findOneAndDelete({ _id: id });
    if (deletedThought) {
      res.status(200).json({
        success: true,
        response: deletedThought,
      });
    } else {
      res.status(404).json({ success: false, response: "Not found" });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
