import express from "express"
const listEndPoints = require("express-list-endpoints")
import { ThoughtModel } from "../models/Thought"

const router = express.Router()

// Route to list all the endpoints
router.get("/", async (req, res) => {
    const endpoints = listEndPoints(req.app)
    res.json(endpoints)
  })

router.post("/thoughts", async (req, res) => {
    const { message, hearts } = req.body
    const newMessage = new ThoughtModel({message, hearts})
    await newMessage.save()
    res.json(newMessage)
})
  
  
  export default router