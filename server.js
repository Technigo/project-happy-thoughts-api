import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const { Schema } = mongoose;

const thoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    // so as to hinder spam:
    unique: true,
    minlength: 5,
    maxlength: 140,
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

const Thought = mongoose.model("Thought", thoughtSchema);

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
  res.send("Hello Technigo!!!");
});

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec();
  try {
  res.status(200).json({
    success: true,
    body: thoughts,
    message: "Success"
  });
} catch(e) {
  res.status(400).json({
    success: false,
    body: e,
    message: "Could not fetch list"
  });
}
});
// Endpoint to post a thought:
app.post('/thoughts', async (req, res) => {
  // Retreieve information sent by the client to our API endpoint:
  const { message } = req.body;
  // Use our mongoose model to create the database entry:
  const thought = new Thought({message});
  try {
    // Success!
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  }
  catch (err) {
    res.status(400).json({message: 'Could not save thought', error: err.errors});
  }
})

// Testing endpoint to find a single thought (it works):
app.get('/thoughts/:_id', async (req, res) => {
  try {
    const singleThought = await Thought.findById(req.params._id);
    if (singleThought) {
      res.status(200).json({
        message: "Here is a thought",
        success: true,
        body: singleThought
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Faulty ID"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

// Endpoint to like a single thought:
app.post('/thoughts/:_id/like', async (req, res) => {
    try {
      const singleThought = await Thought.findById(req.params._id);
      if (singleThought) {
        singleThought.hearts += 1;
        await singleThought.save();
        res.status(200).json({
          success: true,
          message: "Thought successfully liked!",
          singleThought: singleThought
        });
      } else {
        res.status(404).json({
          success: false,
          body: {
            message: "Faulty ID"
          }
        })
      }
    } catch(e) {
      res.status(500).json({
        success: false,
        body: {
          message: "Server error",
          error: err
        }
      })
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
