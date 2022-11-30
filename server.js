import express from "express";
import cors from "cors";
import mongoose from "mongoose";

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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

const HappyThoughtSchema = new mongoose.Schema({
  thought: {
    type: String,
    minlenght: 4,
    maxlength: 140,
  },
  counter: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

// app.get("/thoughts", async (req, res) => {

// })

const HappyThought = mongoose.model("HappyThought", HappyThoughtSchema)

app.post("/thoughts", async (req, res) => {
  const { thought } = req.body
  console.log(req.body)
  try {
    const newThought = await new HappyThought({ thought: thought }).save()
    res.status(201).json({ success: true, response: newThought })
  } catch (error) {
    res.status(400).json({ success: false, response: error })
  }
})

app.patch("/thoughts/:id/counter", async (req, res) => {
  const { id } = req.params
  try {
    const thoughtToAddLike = await HappyThought.findByIdAndUpdate(id, { $inc: { counter: 1 } })
    res.status(200).json({ success: true, response: `One more like for ${thoughtToAddLike.thought}` })
  } catch (error) {
    res.status(400).json({ success: false, response: error })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
