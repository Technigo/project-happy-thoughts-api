import express from "express";
import { ThoughtModel } from "../models/Thought";

const router = express.Router(); // Function to create a new router object to handle requests

router.get("/", (req, res) => {
    res.json("Hello there!");
})

router.get("/thoughts", async (req, res) => {
    // Use the ThoughtModel to find all the thoughts in the database, return max 20 thoughts sorted by createdAt in descending order to show the most recent thoughts first
    try {
        const thoughts = await ThoughtModel.find().sort({createdAt: "desc"}).limit(20).exec();
        res.json(thoughts);
    } catch (err) {
        res.status(400).json({message: "Cannot load thoughts", error: err.errors});
    }
})

// This endpoint expects a JSON body with the thought message, like this: { "message": "Express is great!" }. If the input is valid (more on that below), the thought should be saved, and the response should include the saved thought object, including its _id.
router.post("/thoughts", async (req, res) => {
    // Retrieve the message sent by the user to our API endpoint
    const {message} = req.body.message;

    // Use the Mongoose model to create the database entry
    const thought = new ThoughtModel({message});

    try {
        // Success
        if (message.length >= 4 & message.length <= 140) {
            const savedThought = await thought.save();
            res.status(201).json(savedThought);
        } else {
            res.status(400).json("Your message must be between 4 and 140 characters long");
        }    
    } catch (err) {
        res.status(400).json({message: "Cannot save thought to the database", error: err.errors});
    }
})

export default router;