import express from "express";
import Thought from "../models/Thought";
import listEndpoints from "express-list-endpoints";

const router = express.Router();

// Endpoint to get a list of available routes
router.get("/", (_, res) => {
    res.json(listEndpoints(router));
});

// Endpoint to fetch thoughts (GET)
router.get("/thoughts", async (_, res) => {
    try {
        // Fetches the latest 20 thoughts sorted by createdAt timestamp
        const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
        res.json(thoughts);
    } catch (error) {
        // Handles errors if fetching thoughts fails
        res.status(400).json({ error: "Could not fetch thoughts", details: error.message });
    }
});

// Endpoint to create a new thought (POST)
router.post("/thoughts", async (req, res) => {
    try {
        const { message } = req.body;
        // Creates a new thought with the provided message
        const thought = await Thought.create({ message });

        res.status(201).json(thought);
    } catch (error) {
        // Handles errors for invalid input while creating a thought
        res.status(400).json({ error: "Invalid input", details: error.message });
    }
});

// Endpoint to add a like to a thought (POST)
router.post("/thoughts/:thoughtId/like", async (req, res) => {
    try {
        const { thoughtId } = req.params;
        // Finds the thought based on the provided ID
        const thought = await Thought.findById(thoughtId);

        if (!thought) {
            // Handles scenario where the thought is not found
            return res.status(404).json({ error: " Thought not found" });
        }

        // Increments the 'hearts' count for the thought and saves it
        thought.hearts += 1;
        await thought.save();

        res.json(thought);
    } catch (error) {
        // Handles errors if liking the thought fails
        res.status(400).json({ error: "Could not like the thought", details: error.message });
    }
});

export default router;
