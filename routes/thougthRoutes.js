import express from "express";
import { ThoughtModel } from "../models/Thought";

const router = express.Router(); // Function to create a new router object to handle requests

// This endpoint should return a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.
router.get("/thoughts", async (req, res) => {
    // Use the ThoughtModel to find all the thoughts in the database, return max 20 thoughts sorted by createdAt in descending order
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
    const newMessage = req.body.message;

    // Use the Mongoose model to create the database entry
    const thought = new ThoughtModel({message: newMessage});

    try {
        // Success
        if (newMessage.length >= 4 & newMessage.length <= 140) {
            const savedThought = await thought.save();
            res.status(201).json(savedThought);
        } else {
            res.status(400).json("Your message must be between 4 and 140 characters long");
        }    
    } catch (err) {
        res.status(400).json({message: "Cannot save thought to the database", error: err.errors});
    }
})

// This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its "hearts" property to add one heart
router.post("/thoughts/:thoughtId/like", async (req, res) => {
    const {thoughtId} = req.params;

    try {
        // Use ThoughtModel to find the thought with the given ID, increment the number of hearts by 1 and return the updated document, otherwise findByIdAndUpdate will return the original document before any modifications.
        const likedThought = await ThoughtModel.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}}, {new: true});
        
        if (likedThought) {
            res.status(200).json(likedThought);
        } else {
            res.status(400).json({message: "Thought not found"});
        } 
    } catch (err) {
        res.status(400).json({message: "Cannot update the number of likes for this message", error: err.errors});
    }
})

export default router;