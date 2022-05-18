import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

const TextSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, "Please type a message."],
    minLength: [
      5,
      "Your text must be minimum 5 characters and it was '{VALUE}' characters.",
    ],
    maxLength: [
      140,
      "Your text must be max 140 characters and it was '{VALUE}' characters.",
    ],
    trim: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  ex: {
    type: String,
    required: [true, "Please type your ex's name."],
    minLength: [
      4,
      "Your ex's name must be minimum 4 characters and it was '{VALUE}' characters.",
    ],
    maxLength: [
      15,
      "Your ex's name must be max 15 characters and it was '{VALUE}' characters.",
    ],
    trim: true,
  },
});

const Text = mongoose.model("Message", TextSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send([
    { "/": "Hi! This is the text your ex backend" },
    { "https://textyourex.netlify.app/": "Frontend here!" },
  ]);
});

// GET ALL TEXTS - LIMIT AT 20
app.get("/texts", async (req, res) => {
  try {
    const texts = await Text.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.status(200).json({ success: true, data: texts });
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request, could not fetch thoughts.",
      error: err.errors,
    });
  }
});

// POST A NEW TEXT
app.post("/texts", async (req, res) => {
  const { message, ex } = req.body;
  try {
    const newText = await new Text({
      message: message,
      ex: ex.toLowerCase(),
    }).save();
    res.status(201).json(newText);
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request, could not save this new thought.",
      error: err.errors,
    });
  }
});

// POST A LIKE TO THE TEXT
app.post("/texts/:textId/like", async (req, res) => {
  const { textId } = req.params;
  try {
    const likeText = await Text.findByIdAndUpdate(textId, {
      $inc: { likes: 1 },
    });
    res.status(201).json(likeText);
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request, could not find and update this thought.",
      error: err.errors,
    });
  }
});

// RETURN MOST LIKED TEXTS - 20 TEXTS
app.get("/mostliked", async (req, res) => {
  try {
    const texts = await Text.find().sort({ likes: "desc" }).limit(20).exec();
    res.status(200).json({ success: true, data: texts });
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request, could not fetch thoughts.",
      error: err.errors,
    });
  }
});

// SEARCH FOR EX TEXTS BY NAME - LIMIT TO 20 TEXTS - THIS ISN'T WORKING
app.get("/ex/:name", async (req, res) => {
  const exName = req.params.name.toLowerCase();
  console.log(exName);
  try {
    const texts = await Text.find({ ex: exName });
    console.log(texts);
    // .sort({ likes: "desc" })
    // .limit(20);
    res.status(200).json({ success: true, data: texts });
  } catch (err) {
    res.status(400).json({
      success: false,
      status_code: 400,
      message: "Bad request, could not fetch thoughts.",
      error: err.errors,
      data: [
        { message: "Person not found" },
        { likes: 0 },
        { ex: "???" },
        { createdAt: new Date() },
      ],
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
