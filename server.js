import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8081;
const app = express();

// Coding along with Damien:
// const Note = mongoose.model("Note", {
//   text: "String",
//   createdAt: {
//     type: "Date",
//     default: () => new Date(),
//   },
// });

// // Post req Codealong with Damien
// app.post("/happy", async (req, res) => {
//   const note = new Note(req.body);
//   await note.save();
//   res.json(note);
// });

// Codealong Lice Session with Daniel:
////////////////////////////////////////
// Mongoose schema:
const ThoughtSchema = new mongoose.Schema({
  message: {
    // the most important is type
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    // trim deletes whitespace but only from the begining and the end of the desctiption space
    trim: true,
    // Enum takes an array of values that will be accepted, i.e. for names
    // enum: ["Karin", "Petra"],
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: String,
  },
  // Red level (to complete on the front end if I have time later)
  // tag: {
  //   type: String,
  //   required: true,
  //   enum: ["Hobby", "Relationships", "Work", "Self care", "Food", "Nature"],
  // },
  // name: {
  //   type: String,
  //   trim: true,
  //   required: true,
  //   maxlength: 50,
  // },
});

// Mongoose model:
const Thought = mongoose.model("Thought", ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Endpoints
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

// Post req codealong with Daniel
//////////////////////////////////
//Get all thoughts in descending order, maximum of 20
app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(thoughts);
});

// Post a new thought
// We have three paramaters as default value, so we will need to take those in
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const createdAt = new Date(Date.now()).toLocaleString("sv-SE", {
    timeZone: "Europe/Stockholm",
  });
  const happyThought = new HappyThought({ message, createdAt });
  try {
    const newThought = await new Thought({ message, tag, name }).save();
    res.status(201).json({ response: newThought, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

//Update number of likes using thought id
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedLikes = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $inc: {
          hearts: 1,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ response: updatedLikes, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
