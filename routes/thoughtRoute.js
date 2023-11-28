import express from "express";
import { ThoughtModel } from "../models/Thought";
import listEndpoints from "express-list-endpoints";

const router = express.Router();

// GET /thoughts
router.get("/thoughts", async (req, res) => {
    try {
        const thoughts = await ThoughtModel.find()
            .limit(20)
            .sort({ createdAt: -1 });

        res.json(thoughts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /thoughts
router.post("/thoughts", async (req, res) => {
    try {
        const { message } = req.body;

        // Validate input
        if (!message || message.length < 5 || message.length > 140) {
            return res.status(400).json({
                error: "Invalid input. Message should be between 5 and 140 characters.",
            });
        }

        const thought = new ThoughtModel({ message });
        const savedThought = await thought.save();

        res.json(savedThought);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// POST /thoughts/:thoughtId/like
router.post("/thoughts/:thoughtId/like", async (req, res) => {
    try {
        const { thoughtId } = req.params;

        // Find thought by id
        const thought = await ThoughtModel.findById(thoughtId);

        // Check if thought exists
        if (!thought) {
            return res.status(404).json({ error: "Thought not found" });
        }

        // Update hearts property
        thought.hearts += 1;

        // Save updated thought
        const updatedThought = await thought.save();

        res.json(updatedThought);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint to list all routes
router.get("/", (req, res) => {
    try {
        const endpoints = listEndpoints(router);
        res.json(endpoints);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
