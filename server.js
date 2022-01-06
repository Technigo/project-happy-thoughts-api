import express from "express";
import cors from "cors";
import mongoose, { Schema } from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// v1 Schema method:
const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true, //checks whitespaces in the beginning and the end of the string - still counts the spaces between words.
  },
  hearts: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ["Food thoughts", "Home thoughts", "Work thoughts"],
  },
  name: String,
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

const Thought = mongoose.model("Thought", ThoughtSchema);

// v2 Moongose method:
// const Thought = mongoose.model("Thought", {
//   message: { type: String, required: true, minlength: 5, maxlength: 140 },
//   hearts: { type: Number, default: 0 },
//   category: String,
//   name: String,
//   createdAt: {
//     type: Date,
//     default: () => new Date(),
//   },
// });

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
// v1 async await method
app.post("/thoughts", async (req, res) => {
  try {
    const { name, message, category } = req.body;
    const newThought = await new Thought({
      message,
      name,
      category,
    }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false,
    });
  }
});

// v2 promises -
// app.post("/thoughts", (req, res) => {
//   const { name, message, category } = req.body;

//   new Thought({ name, message, category })
//     .save()
//     .then((data) => {
//       res.status(201).json({ response: data, success: true });
//     })
//     .catch((error) => {
//       res.status(400).json({ response: error, success: false });
//     });
// });

// v3 - mongoose callback
// app.post(`/thoughts`, (req, res) => {
//   const { name, message, category } = req.body;
//   new Thought({ name, message, category }).save((error, data) => {
//     if (error) {
//       res.status(400).json({ response: error, success: false });
//     } else {
//       res.status(201).json({ response: data, success: true });
//     }
//   });
// });

app.get("/thoughts", async (req, res) => {
  const queryCategory = req.query.category;

  // if there is not a queryCategory it is gonna show all of the categories in descending order
  if (!queryCategory) {
    const thoughts = await Thought.find()
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(20);
    // else it is gonna find the category which matches the queryCategory
  } else {
    const thoughts = await Thought.find({ category: queryCategory })
      .sort({
        createdAt: -1,
      })
      .skip(0)
      .limit(20);
  }
});

app.post("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;
  // Use findByIdAndUpdate to increase the heart with 1
  try {
    const updatedLikes = await Thought.findByIdAndUpdate(id, {
      $inc: { hearts: 1 },
    });
    res.status(200).json({ response: updatedLikes, success: true });
  } catch (error) {
    res.status(404).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
