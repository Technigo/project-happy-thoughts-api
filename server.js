import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const port = process.env.PORT || 8080;
const app = express()

const ThoughtSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createAt: {
    type: Date,
    default: () => Date.now(),
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema)


// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())


// Start defining your routes here
app.get("/", (req, res) =>
  res.send(listEndpoints(app)))

app.get("/thoughts", async (req, res) => {
  const allThoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec()
  res.json(allThoughts)
})

app.post("/thoughts", async (req, res) => {
  const { message } = req.body

  try {
    const newThought = await new Thought({ message }).save()
    res.status(201).json({
      response: newThought,
      success: true
    })
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false
    })
  }
})

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params

  try {
    const updatedHearts = await Thought.findByIdAndUpdate(
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
    res.status(200).json({
      response: updatedHearts,
      success: true
    })
  } catch (error) {
    res.status(200).json({
      response: error,
      success: false
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
