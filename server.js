// /////////////////////////////// IMPORT //////////////////////////////// //
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// ////////////////////CONNECTION TO DISPLAY ///////////////////////////// //
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-happy-thoughts-api";;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtsSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },

  likes: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model("Message", ThoughtsSchema);

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// //////////////////////////// APP - ROUTES ////////////////////////////////////////// //
// Startpage endpoint
app.get("/", (req, res) => {
  res.send({
    "Hello": "Welcome to this Happy Thought API!",
    "Endpoints": [
      {
        "/": "Startpage / Api Info"
      },
      {
        "/thoughts": "GET. See 20 thoughts in descending order"
      },
      {
        "/thoughts": "POST. Post your thoughts"
      }
    ]
  });
});

app.get('/thoughts', async (req, res) => {
  const thoughtsList = await Message.find().sort({ createdAt: 'desc' }).limit(20).exec();
  try {
    res.status(200).json({
      success: true,
      response: thoughtsList,
      message: "get successfull"
    });
  }

  catch (err) {
    res.status(400).json({
      success: false,
      message: 'Could not save thought to database',
      error: err.errors
    });
  }
});

app.post('/thoughts', async (req, res) => {
  const { message, createdAt } = req.body;
  try {
    const savedThought = await new Message({ message, createdAt }).save()
    res.status(200).json({
      success: true,
      response: savedThought,
      message: "post successfull"
    });
  }

  catch (err) {
    res.status(400).json({
      success: false,
      response: err,
      message: 'Could not save thought to database', error: err.errors
    });
  }
});

app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const updateLikes = await Message.findByIdAndUpdate(thoughtId, { $inc: { likes: 1 } });
    res.status(201).json({
      success: true,
      response: `Happy thought: ${updateLikes.message} has updated likes`
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Could not save like to database',
      response: error
    });
  }
});




// POST - create something
// PATCH - update
// PUT - replace
// DELETE - delete


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});









