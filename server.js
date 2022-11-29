import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
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

const ThoughtsSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Thought = mongoose.model("Thought", ThoughtsSchema);

app.get("/endpoints", (req, res) => {
  res.send(listEndpoints(app))
});

app.get("/", (req, res) => {
  const HappyThoughtsApi = {
    Welcome: 'Hi! This is the happy-thoughts-API from https://happy-thoughts-antonella.netlify.app/',
    Routes: [{
      "/thoughts": 'Get all Happy Thoughts.'
    }]
  }
  res.send(HappyThoughtsApi);
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find()
    res.status(200).json(thoughts)
  } catch (error) {
    res.status(400).json({ message: "Failed to load thoughts" })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
