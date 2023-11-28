import express from "express";
import listEndpoints from "express-list-endpoints";
//import { ThoughtModel } from "../models/ThoughtModel";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "OK",
    body: {
      content: "Susannes Happy thoughts API",
      endpoints: listEndpoints(router),
    },
  });
  //   const endpoints = listEndpoints(router);
  res.json(endpoints);
});

//const { ThoughtModel } = require("ThoughtModel");

router.post("/thoughts", async (req, res) => {
  const { message } = req.body;

  // Validate user input against the model schema
  try {
    const newThought = new ThoughtModel({ message });
    await newThought.validate();

    // Save the thought if validation succeeds
    const savedThought = await newThought.save();

    res.status(200).json({
      success: true,
      message: "Thought successfully created",
      response: savedThought,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Bad request",
      error: error.message,
    });
  }
});

// router.post("/thoughts", async (req, res) => {
//   const { message } = req.body;
//   try {
//     const newThought = await new ThoughtModel({ message }).save();
//     res.status(200).json({
//       success: true,
//       message: "Thought successfully created",
//       response: newThought,
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
