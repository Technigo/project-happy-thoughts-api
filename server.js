import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

// Defines the port the app will run on.
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

//Schemas and models
const Thought = mongoose.model("Thought", {
  message: String,
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
  res.send("Hello Technigo!")
})

app.post("/thoughts", async (req, res) => {
  const thought = new Thought({message: req.body.message})
  await thought.save()
  res.json(thought)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
