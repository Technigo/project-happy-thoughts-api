import express from "express";
import listEndpoints from "express-list-endpoints";
import { ThoughtModel } from "../models/ThoughtModel";

const router = express.Router();
const endpoints = listEndpoints(router);
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// List of all endpoints
router.get("/", async (req, res) => {
  try {
    // Perform asynchronous operation (e.g., fetching data from the ThoughtModel)
    const thoughts = await ThoughtModel.find();

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
    const result = await ThoughtModel.find();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: "Bad request", error });
  }
});

router.post("/thoughts", urlencodedParser, async (req, res) => {
  try {
    const newThought = await new ThoughtModel(req.body).save();
    res.status(200).json(newThought);
  } catch (error) {
    res.status(400).json({ message: "Bad request", error });
  }
});

//const { ThoughtModel } = require("ThoughtModel");

// router.post("/thoughts", async (req, res) => {
//   const { message } = req.body;

//   // Validate user input against the model schema
//   try {
//     const newThought = new ThoughtModel({ message });
//     await newThought.validate();

//     // Save the thought if validation succeeds
//     const savedThought = await newThought.save();

//     res.status(200).json({
//       success: true,
//       message: "Thought successfully created",
//       response: savedThought,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Bad request",
//       error: error.message,
//     });
//   }
// });

export default router;
