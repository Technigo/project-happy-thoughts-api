import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

// Error messages:
const ERR_CANNOT_FIND_THOUGHTS = 'No thoughts found';
const ERR_CANNOT_POST_THOUGHT = 'Could not POST thought to Database';

// Mongoose & Database setup:
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// -----------------------------------------------
// Mongoose model setup:
const Thought = mongoose.model("Thought", {
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
  },
});

// -----------------------------------------------
// To reset database:
// $ RESET_DATABASE=true npm run dev
// Or via Heroku in Config vars
/*
if (process.env.RESET_DATABASE) {
  console.log("Message: Resetting database");

  const seedDatabase = async () => {
    await Thought.deleteMany();
  };
  seedDatabase();
};
*/

// -----------------------------------------------
// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. 
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());
// Middleware for handling if "no connection to Mongodb":
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// -----------------------------------------------
// Start defining your routes here
// 1: GET the Thoughts, 2: POST a Thought, 3: POST a Like on a Thought

// -----------------------------------------------
// 1: GET the Thoughts

app.get("/", async (req, res) => {
  const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec();
  if (thoughts) {
    res.status(200).json(thoughts);
  } else {
    res.status(404).json({ message: ERR_CANNOT_FIND_THOUGHTS, errors: err.errors  });
  }
});

// -----------------------------------------------
// 2: POST a Thought
// Validate user input
// success / failed via try/catch

app.post("/", async (req, res) => {
  // retrieve message sent by client to our API endpoint:
  const { message } = req.body;
  // use our mongoose model to create the database entry:
  const thought = new Thought({ message });
  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({ message: ERR_CANNOT_POST_THOUGHT, errors: err.errors  });
  }
});

// -----------------------------------------------
// 3: POST a Like on a Thought
// create app.post '/' for heart/like on thought:
// using POST - as I already used POST in my Happy project as method.
// (PUT method is idempotent. So if you send retry a request multiple times, that should be equivalent to single request modification.)
// success / failed via try/catch

app.post('/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;
  try {
    await Thought.updateOne({ '_id': thoughtId }, { '$inc': { 'hearts': 1 } });
    res.status(201).json();
  } catch (err) {
    res.status(404).json({ message: `Could not like ${thoughtId}`, error: err.errors });
  }
})

// -----------------------------------------------
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
