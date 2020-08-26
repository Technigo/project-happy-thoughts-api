import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import Thought from "./models/thoughts";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8070;
const app = express();

//middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

//routes
app.get("/", async (req, res) => {
  const {
    page = 1,
    tag,
    name,
    minLikes,
    sort = "createdAt",
    order = "desc",
  } = req.query;

  const limit = 20;

  let databaseQuery = Thought.find();

  if (tag) {
    databaseQuery = databaseQuery.find({
      tag: tag,
    });
  }
  if (name) {
    databaseQuery = databaseQuery.find({
      name: name,
    });
  }
  if (minLikes) {
    databaseQuery = databaseQuery.find({
      likes: { $gte: minLikes },
    });
  }

  databaseQuery = databaseQuery.sort({
    [sort]: order,
  });

  const totalResults = (await databaseQuery).length;
  const pages = Math.ceil(totalResults / limit);

  databaseQuery = databaseQuery.limit(limit).skip(limit * (+page - 1));
  const thoughts = await databaseQuery;

  if (thoughts.length > 0) {
    res.json({ pages, totalResults, thoughts });
  } else {
    res.status(400).json({ error: "No thoughts found" });
  }
});

app.post("/", async (req, res) => {
  const { name, message, tag } = req.body;
  const thought = new Thought({ name, message, tag });

  try {
    const savedThought = await thought.save();
    res.status(201).json(savedThought);
  } catch (err) {
    res.status(400).json({ message: "Could not post ", errors: err.errors });
  }
});

app.post("/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const thought = await Thought.findByIdAndUpdate(
      thoughtId,
      { $inc: { likes: 1 } },
      { useFindAndModify: false }
    );
    res.status(201).json(thought); // returns before incremented, I could not fix this.
  } catch (err) {
    res.status(400).json({ message: "Could not like post", error: err });
  }
});

/* to add 
delete and edit function with time limit

app.delete('/:thoughtId/delete', async (req, res) => {
})

app.put('/:thoughtId/edit', async (req, res) => {
})

*/

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
