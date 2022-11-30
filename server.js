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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Happy Thoughts API");
});

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    trim: true,
    required: true
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

const Thought = mongoose.model("Thought", ThoughtSchema);

app.get("/thoughts", async(req, res) => {
  try {
    const thoughtsFeed = await Thought.find().limit(20).sort({createdAt: 'desc'});
    res.status(200).json({
      success: true,
      response: thoughtsFeed
    });
  } catch(error) {
    res.status(400).json({
      success: false,
      response: error
    })
  }
});

app.post("/thoughts", async(req, res) => {
  const { message } = req.body;
  try { 
    const newThought = await new Thought({message: message}).save();
    res.status(201).json({
      success: true,
      response: newThought
    });
    } catch(error) {
      res.status(400).json({
        success: false,
        reponse: error
      });
    };
});

// V2 mongoose syntax
/* app.post("/thoughts", async(req, res) => {
  const { name, description } = req.body;

  const newThought = await new TechnigoMember({name: name, description: description}).save((error, data) => {
    if(error){
      res.status(400).json({success: false, response: error});
    } else {
      res.status(201).json({success: true, response: data})
    }
  });
}); */

// Update (like-button)

// POST => create
// PUT => replacing something in db
// PATCH => change/modify stuff

app.patch("/thoughts/:id/like", async(req, res) => {
  const { id } = req.params;
  try {
    const thoughtToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {hearts: 1}});
    res.status(200).json(/* {success: true, response: `Member ${thoughtToUpdate.hearts} has been updated`} */);
  } catch (error) {
    res.status(404).json({success: false, response: error});
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
