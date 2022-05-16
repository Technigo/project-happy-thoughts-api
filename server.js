import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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
/////////////////////

const HappyThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 4,
    maxlength: 30, 
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
});

const HappyThought = mongoose.model("HappyThought", HappyThoughtSchema);



app.post("/thoughts", async (req, res) => {

  const { message } = req.body;

  try {
    const newThought = await new HappyThought({message: message}).save();
    
    res.status(201).json({response: newThought, success: true});
  } catch(error) {

    res.status(400).json({response: error, success: false});
  }

});


app.post("/thoughts/:id/hearts", async (req, res) => {
  const { id } = req.params;
  try {
    const thoughtToUpdate = await HappyThought.findByIdAndUpdate(id, {$inc: {hearts: 1}});
    res.status(200).json({response: `Thought ${thoughtToUpdate.message} has been liked`, succes: true});
  } catch (error) {
    res.status(400).json({response: error, succes: false});
  }
});

app.get("/thoughts", (req, res) => {
  // const { id, name } = req.query;
  let thoughts = await HappyThought.find();

  // if (id) {
	// 	authors = authors.filter(item => item._id.toString() === id);
	// };

  // if (name) {
  //   authors = authors.filter(
  //     (author) => author.name.toLowerCase().includes(name.toLowerCase())
  //   )
  // };

  if (thoughts.length > 0) {
    res.json(thoughts);
  } else {
    res.status(404).json({ error: "No happy thoughts found" })
  } 
});

/////////////////////
// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
