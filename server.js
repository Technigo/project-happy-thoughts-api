// import cors from "cors";
// import express from "express";
// import mongoose from "mongoose";

// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
// mongoose.connect(mongoUrl);
// mongoose.Promise = Promise;

// // Defines the port the app will run on. Defaults to 8080, but can be overridden
// // when starting the server. Example command to overwrite PORT env variable value:
// // PORT=9000 npm start
// const port = process.env.PORT || 8080;
// const app = express();

// // Add middlewares to enable cors and json body parsing
// app.use(cors());
// app.use(express.json());

// // Start defining your routes here
// app.get("/", (req, res) => {
//   res.send("Hello Technigo!");
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happythoughts";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//Model
const { Schema, model } = mongoose;
const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  numberOfLikes: {
    type: Number,
    default: 0,
  },
});

const Thought = model("Thought", thoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Happy thoughts!");
});

//Get all thoughts
app.get("/thoughts", async (req, res) => {
  const allThoughts = await Thought.find();

  if (allThoughts.length > 0) {
    res.json(allThoughts);
  } else {
    res.status(404).send("No thoughts was found");
  }
});

//Post new though
app.post("/thoughts", async (req, res) => {
  const { message, date, numberOfLikes } = req.body;

  try {
    const thought = await new Thought({
      message,
      date,
      numberOfLikes,
    }).save();

    res.status(201).json({
      success: true,
      response: thought,
      message: "Thought created and saved",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Couldn't save new thought",
    });
  }
});

//Update likes count
app.patch("/thoughts/:id", async (req, res) => {
  const { id } = req.params;

  const { numberOfLikes } = req.body;

  try {
    const thought = await Thought.findByIdAndUpdate(
      id,
      { numberOfLikes: numberOfLikes },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      response: thought,
      message: "Number of likes updated",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error,
      message: "Couldn't update number of likes",
    });
  }
});

// app.patch("/thoughts/:id", async (req, res) => {
//   const { id } = req.params;

//   const { addLike } = req.body;

//   try {
//     const thought = await Thought.findByIdAndUpdate(
//       id,
//       { numberOfLikes: addLike },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       response: thought,
//       message: "Number of likes updated",
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       response: error,
//       message: "Couldn't update number of likes",
//     });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
