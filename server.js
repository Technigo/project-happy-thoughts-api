import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thought = mongoose.model("Thought", {
    message: String,
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
    hearts: {
        type: Number,
        default: 0,
    },
});

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
    res.send("Hello world");
});

app.get("/thoughts", (req, res) => {
    Thought.find().then((thoughts) => {
        res.json(thoughts);
    });});

app.post("/thoughts", async (req, res) => {
    const thought = new Thought({message: req.body.message});
    await thought.save()
    res.json(thought)
});

// Start the server
app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Server running on http://localhost:${port}`);
});
