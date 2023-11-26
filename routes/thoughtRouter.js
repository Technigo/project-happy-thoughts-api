import express from "express";
const router = express.Router();
const { Thought } = require("../models/ThoughtsModel");
const asyncHandler = require("express-async-handler");
const listEndpoints = require("express-list-endpoints");


// ------------ ERROR HANDLING ROUTE ------------ //
router.get("/", asyncHandler(async (req, res) => {
    try {
        const endpoints = listEndpoints(router);
        res.json(endpoints);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong" });
    }
}));

// This endpoint returns a maximum of 20 thoughts, sorted by `createdAt` to show the most recent thoughts first
router.get("/thoughts", async (req, res) => {
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20).exec();
    res.json(thoughts);
});

// This endpoint expects a JSON body with the thought `message`. If the input is valid, the thought should be saved otherwise an error is shown
router.post("/thoughts", async (req, res) => {
    const { message } = req.body;
    const thought = new Thought({ message });

    try {
        // Successful in saving thought
        const savedThought = await thought.save();
        res.status(201).json(savedThought);
    } catch (error) {
        // Failed to save thought
        res.status(400).json({ message: "Thought could not be saved.", error: error.errors })
    }
});

// Route just to see that I can get each individual thought
router.get("/thoughts/:_id", async (req, res) => {
    const thoughtId = req.params._id; // Adds the id from the url/param to a variable called thoughtId

    // Tries finding the thought based on the id entered into the url/param
    try {
        const singleThought = await Thought.findById(thoughtId);
        // If there is a valid thought found, then it's displayed on the screen.
        res.status(200).json({ body: singleThought })
    } catch (error) {
        // Show an error-message if thought can't be found
        res.status(400).json({ message: "Id not in database", error: error })
    }
})

// Route to post/add likes to a thought
router.post("/thoughts/:_id/like", async (req, res) => {
    const thoughtId = req.params._id; // Adds the id from the url/param to a variable called thoughtId

    // Tries saving the like
    try {
        // Finds a thought from the database that matches the id from the url, and saves into a variable called thought
        const thought = await Thought.findById(thoughtId);
        // If there is a valid thoughtId, then hearts is increased by one and value is saved into database.
        if (thoughtId) {
            thought.hearts += 1;
            await thought.save();
            // This is for something visual in Postman during development
            // res.status(200).json({ message: "Thought successfully liked!", thought: thought })
        }
        // Show an error-message if thought can't be liked
    } catch (error) {
        res.status(400).json({ error: "Couldn't save like, check that you enter a correct id" });
    }
});

// Exports the router
module.exports = router;