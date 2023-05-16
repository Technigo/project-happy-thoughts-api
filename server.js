import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const { Schema } = mongoose;
const ThoughtSchema = new Schema({

  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now, // versus new Date?
    readOnly: true // need to be non assignable - fix 
  }

})

ThoughtSchema.pre('save', function (next) {
  // Make the hearts property non-assignable by setting it to 0 before saving
  this.hearts = 0;
  next();
});

const Thought = mongoose.model("Thought", ThoughtSchema);

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
  res.send("Hello Technigo!");
});

// GET
app.get('/thoughts', async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec(); //execute
  res.json(thoughts);
  try {
  res.status(200).json({
    success: true,
    response: Thought,
    message: "Thoughts retreived"
  })
} catch (err) {
  res.status(400).json({
    success: false,
    response: e,
    message: "Error, no thoughts found"
  })
}


})

// POST
app.post('/thoughts', async (req, res) => {
  const { message, hearts, createdAt } = req.body;
  const thoughts = new Thought({message, hearts, createdAt});
  try {
    const savedThought = await thoughts.save();
    res.status(201).json(savedThought);
  }
  catch(err) {
    res.status(400).json({message: "Could not save thought to the database"})

  };
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
