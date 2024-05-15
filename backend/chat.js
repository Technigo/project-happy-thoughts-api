import express from "express"
import mongoose from "mongoose"
import ChatMessage from "./chatMessageModel.js"
import dotenv from "dotenv"

dotenv.config()

const router = express.Router()

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`, {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "Anslutningsfel:"))
db.once("open", () => {
  console.log("Ansluten till databasen")
})

router.use(express.json())

router.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await ChatMessage.find().sort({ createdAt: -1 }).limit(20)
    res.json(thoughts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/thoughts", async (req, res) => {
  const { message } = req.body

  try {
    const thought = new ChatMessage({ message })
    await thought.save()
    res.status(201).json(thought)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params

  try {
    const thought = await ChatMessage.findById(thoughtId)
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" })
    }
    thought.hearts++
    await thought.save()
    res.json(thought)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
