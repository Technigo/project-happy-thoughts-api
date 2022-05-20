import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import startDB from "./database/database.js";
import { dbErrorHandler } from "./middleware/dbErrorHandler.js";
import HappyThought from "./database/happtThoughts.js";

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());
app.use(dbErrorHandler);

//Router setup
app.get("/", (req, res) => {
  const landing = {
    about: "Welcome to My Happy Thought API😻",
    APIs: listEndpoints(app),
  };
  res.send(landing);
});

app.get("/thoughts", async (req, res) => {
  try {
    let data = await HappyThought.find().limit(20).sort({ createdAt: "desc" });
    if (!data.length) {
      return res.status(404).json({ error: "No result found" });
    }
    return res.status(200).json([...data]);
  } catch (err) {
    return res.status(400).json({ error: err.toString() });
  }
});

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  const createdAt = new Date(Date.now()).toLocaleString("sv-SE", {
    timeZone: "Europe/Stockholm",
  });
  const happyThought = new HappyThought({ message, createdAt });

  try {
    //success
    const savedHappyThought = await happyThought.save();
    res.status(201).json(savedHappyThought);
  } catch (err) {
    //error
    res.status(400).json({
      message: "Could not save happy thought to the database",
      error: err.errors,
    });
  }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const thoughtID = req.params.thoughtId;
  try {
    const updated = await HappyThought.findOneAndUpdate(
      { _id: thoughtID },
      { $inc: { hearts: 1 } },
      { new: true }
    );
    res.status(201).json(updated);
  } catch (err) {
    return res
      .status(400)
      .json({ error: `Cannot find happy thought by id: ${thoughtID}` });
  }
});

startDB().then(
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  })
);
