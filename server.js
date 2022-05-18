import express, { application, json } from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


const Thought = mongoose.model('Thought', {
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  heart: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// ----------------------/START-------------------------- //
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});



// ----------------------/GET THOUGHT-------------------------- //
app.get('/thoughts', async (req, res) => {

  const { page, perPage } = req.query

  try {
    const thoughts = await Thought.find({}).sort({createdAt: -1})
    .skip((page - 1 * perPage)).limit(perPage)

    res.status(200).json({success: true, response: thoughts})
   } catch (error) {
    res.status(400).json({success: false, response: error})
   }

})



// ----------------------/UPDATE LIKE ON HEART---------------------- //
app.patch("/thoughts/:id", async (req, res) => {
  const { id } = req.params
  const { updatedLike } = req.body

  try {
    const thoughtToLike = await Thought.findByIdAndUpdate({_id: id}), {heart = updatedLike}

    if (thoughtToLike) {
    res.status(200).json({success: true, response: deleted}) 
  }
  } catch (error) {
    res.status(400).json({success: false, response: error})
  }
})


// ----------------------/POST THOUGHT------------------------ //
app.post('/thoughts', async (req, res) => {
  // Retrieve the information sent by the client to our API endpoint
  const { message } = req.body

  // // Use our mongoose model to create the database entry
  const thought = new Thought({ message })

  try {
    // Success case
    const savedThought = await thought.save()
    res.status(201).json(savedThought)
  } catch (err) {
    res.status(400).json({message: 'Could not save thought to the database', error: err.errors})
  }
})



// ----------------------/START SERVER------------------------ //
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
