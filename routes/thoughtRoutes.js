import express from "express";
import listEndpoints from "express-list-endpoints";
import { ThoughtModel } from "../models/ThoughtModel";

const router = express.Router();
//const bodyParser = require("body-parser");

//const urlencodedParser = bodyParser.urlencoded({ extended: false });

// List of all endpoints
router.get("/", async (req, res) => {
  try {
    // Perform asynchronous operation (e.g., fetching data from the ThoughtModel)
    //const thoughts = await ThoughtModel.find();

    // Construct the response with the fetched data
    res.status(200).send({
      success: true,
      message: "OK",
      body: {
        content: "Susannes Happy thoughts API",
        endpoints: listEndpoints(router),
      },
    });
  } catch (error) {
    // Handle errors gracefully
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// List of all thoughts - this should be limited to show only the 20 most recent thoughts
router.get("/thoughts", async (req, res) => {
  try {
    const result = await ThoughtModel.find()
      .sort({ createdAt: "desc" })
      .limit(20);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Bad request", error });
  }
});

router.post("/thoughts", async (req, res) => {
  try {
    const newThought = new ThoughtModel(req.body);
    newThought.hearts = 0; // Prevents the user from changing the heart
    newThought.createdAt = new Date(); // Prevents the user from changing the date
    await newThought.save();
    res.status(200).json(newThought);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Bad request", error });
  }
});

router.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const updatedThought = await ThoughtModel.findOneAndUpdate(
      { _id: thoughtId },
      { $inc: { hearts: 1 } },
      { new: true }
    );
    if (updatedThought) {
      res.status(200).json(updatedThought);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Bad request", error });
  }
});

export default router;
