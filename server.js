import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import { thoughtSchema } from "./schema";
import { mongoConnectionMiddleware } from "./middleware";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });//I have some problems deploying I keep the second parameter even if this is old coding ;)
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// PORT=8080 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
app.use(mongoConnectionMiddleware);

//Thought model
const Thought = mongoose.model("Thought", thoughtSchema);

//Here the routes GET and POST
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  const documentation = {
    Welcome: "This is the Happy Thoughts API!",
    Endpoints: endpoints,
  };
  res.json(documentation);
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(thoughts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { hearts: 1 } },
      { new: true }
    );

    if (!thought) {
      return res.status(404).json({ error: "Thought not found" });
    }

    res.status(200).json(thought);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
