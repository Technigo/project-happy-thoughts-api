/* eslint-disable comma-dangle */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const ThoughtSchema = new mongoose.Schema({
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
  score: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

// eslint-disable-next-line no-unused-vars
const Thought = mongoose.model("thought", ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/thoughts", async (req, res) => {
  const thought = await Thought.find().sort({ createdAt: -1 }).limit(20).exec();
  res.status(200).json(thought);
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  try {
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line new-cap
    const newthought = await new Thought({ message }).save();
    res.status(201).json({ response: newthought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, succes: false });
  }
});

app.post("/thoughts/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    // eslint-disable-next-line max-len
    const heartsCount = await Thought.findByIdAndUpdate(id, { $inc: { hearts: 1 } }, { new: true });
    if (heartsCount) {
      res.status(200).json({ response: heartsCount, succes: true });
    } else {
      res.status(404).json({ response: "No happy thought found", succes: false });
    }
  } catch (error) {
    res.status(400).json({ response: error, succes: false });
  }
});

// This is the code for delete and patch from the live sessions
// -------------------------------------------------------------------------
// app.delete("/members/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedMember = await Member.findOneAndDelete({ _id: id });
//     if (deletedMember) {
//       res.status(200).json({ response: deletedMember, succes: true });
//     } else {
//       res.status(404).json({ response: "Member not found", succes: false });
//     }
//   } catch (error) {
//     res.status(400).json({ response: error, succes: false });
//   }
// });

// app.patch("/members/:id", (req, res) => {
//   const { id } = req.params;
//   const { name } = req.body;

//   Member.findOneAndUpdate({ _id: id }, { name }, { new: true })
//     .then((updatedMember) => {
//       if (updatedMember) {
//         res.status(200).json({ response: updatedMember, success: true });
//       } else {
//         res.status(404).json({ response: "Member not found", success: false });
//       }
//     })
//     .catch((error) => {
//       res.status(400).json({ response: error, success: false });
//     });
// });
// -------------------------------------------------------------------------------------------
// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
