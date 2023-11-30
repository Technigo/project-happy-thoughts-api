import express from "express";
import { ThoughtModel } from "../models/Thought";
import listEndpoints from "express-list-endpoints";

const router = express.Router();

router.get("/", (req, res) => {
    res.send(listEndpoints(router));
});

router.get("/thoughts", async (req, res) => {
    try {
        const thoughts = await ThoughtModel.find({})
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json(thoughts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/thoughts", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || message.lenght < 5 || message.lenght > 140) {
            return res.status(400).json({
                error: "Invalid input. Message should be between 5 and 140 charachters.",
            });
        }

        const newThought = new ThoughtModel({ message });
        const savedThought = await newThought.save();
        res.status(201).json(savedThought);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/thoughts/:thoughtId/like", async (req, res) => {
    try {
        const { thoughtId } = req.params;
        //Is this even something i need??
        if (!thoughtId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({error: "Invalid thought ID format."});
        }
        const updatedThought = await ThoughtModel.findByIdAndUpdate(
            thoughtId,
            {
                $inc: { hearts: 1 },
            },
            {
                new: true,
            }
        );
        if (!updatedThought) {
            return res.status(404).json({ error: "Thought not found." });
        }
        res.json(updatedThought);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
