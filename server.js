import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  heart: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
});

const Thought = mongoose.model("Thought", ThoughtSchema);

mongoose.set("useFindAndModify", false);

// Start defining your routes here

// first endpoint which sums up the endpoints provided
app.get("/", (req, res) => {
  res.send({
    "Welcome to the Happy thoughts endpoint, here's the list of endpoints to use":
      listEndpoints(app),
  });
});

// endpoint to get the 20 latest thoughts posted to the API
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .exec();
    res.status(200).json(thoughts);
  } catch (error) {
    res
      .status(400)
      .json({ message: "No thoughts found today", success: false });
  }
});

// endpoint to use to post new messages to the API
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({
      message:
        "Could not post thought. Remeber that the min and max characters are 5-140.",
      success: false,
    });
  }
});

// endpoint to increase the likes - click the hearts
app.post("/thougths/:thoughtsId/like", async (req, res) => {
  const { thoughtsId } = req.params;

  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtsId,
      {
        $inc: {
          heart: 1,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ response: updatedThought, success: true });
  } catch (error) {
    res.status(400).json({
      message: "Could not find that specific thought",
      success: false,
    });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
