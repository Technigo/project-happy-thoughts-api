import express from "express";
import listEndpoints from "express-list-endpoints";
import { ThoughtModel } from "../models/Thought";
const router = express.Router();

// Route to get available endpoints
router.get("/", (req, res) => {
  const endpoints = listEndpoints(router);
  res.json({ endpoints });
});

// Route to get all titles from the database
router.get("/thoughts", async (req, res) => {
  await ThoughtModel.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => res.json(err));
});

router.post("/add", async (req, res) => {
  const title = req.body.title;
  // ... (repeat for other properties)

  await ThoughtModel.create({
    title: title,
    // ... (repeat for other properties)
  })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

export default router;
