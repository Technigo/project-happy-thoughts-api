import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import expressListEndpoints from "express-list-endpoints"

// Defines the port the app will run on and connects to mongoose
const port = process.env.PORT || 8080
const app = express()
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable." })
  }
})

//Models
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
    default: () => new Date()
  } 
})

// Start defining your routes here
app.get("/", (req, res) => {
  const documentation = {
    Welcome: "Welcome to the Happy Thoughts API!",
    Endpoints: expressListEndpoints(app).map((endpoint) => {
      return {
        path: endpoint.path,
        methods: endpoint.methods,
        middlewares: endpoint.middlewares,
      }
    })
  }
  res.json(documentation);
})

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20).exec()
    if (thoughts.length > 0) {
      res.json(thoughts)
    } else {
      res.status(404).json({ error: "No thoughts found." })
    }
  } catch (err) {
    res.status(400).json({ message: "Something went wrong.", error: err.errors })
  }
})

app.post("/thoughts", async (req, res) => {
  try {
    const thought = new Thought({message: req.body.message})
    await thought.save()
    res.status(201).json({
       success: true,
       response: thought,
       message: "Thought posted",
     })
  } catch (error) {
    res.status(400).json({  
      success: false,
      response: error,
      message: "Could not save thought."})
  }
})

app.patch("/thoughts/:id/like", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.id,
      { $inc: { hearts: 1 } }, { new: true, runValidators: true })
    res.status(200).json(thought)
  } catch (error) {
    res.status(400).json({ 
      success: false,
      response: error,
      message: "Could not like thought."})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
