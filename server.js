import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { type } from "express/lib/response";

// import listEndpoints from "express-list-endpoints";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/happyThoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const HappyThoughtSchema = new mongoose.Schema({
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
    type: Date,
    default: () => new Date(),
    // type: Number,
    // default: Date.now,
  },
});

const HappyThought = mongoose.model("HappyThought", HappyThoughtSchema);

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

// Start defining your routes here
// add the get thoughts <-------
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new HappyThought({ message }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }

  // promises version
  // app.post("/thoughts", (req, res) => {
  //   const { message } = req.body;

  //   new newThought({message}).save()
  //     .then(data => {
  //       res.status(201).json({response: data, success: true})
  //     })
  //     .catch(error => {
  //       res.status(400).json({ response: error, success: false})
  //     })

  // mongoose callback
  // app.post("/thoughts", (req, res) => {
  // const { message } = req.body;

  // new newThought({message}).save((error, data) => {
  //   if (error) {
  //     res.status(400).json({ response: error, success: false})
  //   } else {
  //     res.status(201).json({response: data, success: true})
  //   }
  // })
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { id } = req.params;

  try {
    const updateThought = await HappyThought.findByIdAndUpdate(
      id,
      {
        $inc: { heart: 1 },
      },
      {
        //options, to update directly
        new: true,
      }
    );
    res.status(200).json({ response: updateThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
