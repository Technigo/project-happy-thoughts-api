import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughtsAPI";
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
  res.send("Happy thoughts on repeat!");
});

const ThoughtsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlenght: 4,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

const Thoughts = mongoose.model("Thoughts", ThoughtsSchema)

app.post("/thoughts", async (req, res) => {
  const { message } = req.body
  console.log(req.body)
  try {
    const newThought = await new Thoughts({ message: message }).save()
    res.status(201).json({ success: true, response: newThought })
  } catch (error) {
    res.status(400).json({ success: false, response: error })
  }
})

app.get("/thoughts", async (req, res) => {
  const response = {
    success: true,
    body: {}
  }
  try {
    response.body = await Thoughts.find().sort({ createdAt: "desc" }).limit(20).exec();
    res.status(200).json({
      success: true,
      body: response
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: error
      }
    });
  }
})

app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params
  try {
    const thoughtToAddLike = await Thoughts.findByIdAndUpdate(thoughtId, { $inc: { hearts: 1 } })
    res.status(200).json({ success: true, response: `One more like for ${thoughtToAddLike.message}` })
  } catch (error) {
    res.status(400).json({ success: false, response: error })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
