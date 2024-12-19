import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import expressListEndpoints from "express-list-endpoints";

dotenv.config();

const mongoUrl = process.env.MONGO_URL; //|| "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 3000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema, model } = mongoose;

// Define mongoose Schema since more complex than just using mongoose model
const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Thought = model('Thought', thoughtSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.json(expressListEndpoints(app));
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: 'desc' }).limit(20).exec();
  res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
  //Retrieve info that is sent by the user to our API endpoint
  // I use {} around message to make sure ONLY message can be sent in by the user, not hearts and createdAt.
  const { message } = req.body;
  // Use our mongoose model to create the database entry
  const thought = new Thought({ message });

  try {
    // Success
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({ message: "Could not save thought to database", error: err.errors });
  }
});

// app.post("/thoughts", async (req, res) => {
//   //Retrieve info that is sent by the user to our API endpoint
//   // I use {} around message to make sure ONLY message can be sent in by the user, not hearts and createdAt.
//   const { message } = req.body;

//   try {
//     // Use our mongoose model to create the database entry
//     const thought = await new Thought({ message }).save();

//     res.status(201).json({
//       success: true,
//       response: thought,
//       message: "thought is created"
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       response: err.errors,
//       message: "Could not save thought to database"
//     });
//   }
// });

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  // Get thoughtId from URL-param
  // Could also do like this: const thoughtId = req.params.thoughtId;
  const { thoughtId } = req.params;

  try {
    // Hitta en tanke med rätt id och öka hearts med 1
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,                  // Hitta dokumentet baserat på ID
      { $inc: { hearts: 1 } },    // Incrementerar hearts med 1
      { new: true }               // Returnera det uppdaterade dokumentet
    );

    if (updatedThought) {
      res.status(200).json(updatedThought); // Skicka tillbaka det uppdaterade dokumentet
    } else {
      res.status(404).json({ message: "Thought not found" }); // Om inget dokument hittas
    }
  } catch (err) {
    res.status(400).json({ message: "Could not update hearts", error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
