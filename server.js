import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 140,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: () => new Date(), //or Date.now
    },
    hearts: {
        type: Number,
        default: 0,
    },
});

const Thought = mongoose.model("Thought", ThoughtSchema);

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

app.get("/thoughts", async (req, res) => {
    const thoughts = await Thought.find()
        .sort({ createdAt: "desc" })
        .limit(20)
        .exec();
    res.json(thoughts);
});

app.post("/thoughts", async (req, res) => {
    try {
        const thought = new Thought({ message: req.body.message });
        await thought.save();
        res.status(201).json({ response: thought, success: true });
    } catch (err) {
        res.status(400).json({
            response: "error",
            errors: err.errors,
            success: false,
        });
    }
});

app.post("/thoughts/:thoughtId/like", async (req, res) => {
    const { thoughtId } = req.params;

    try {
        const updatedThought = await Thought.findByIdAndUpdate(
            thoughtId,
            {
                $inc: { hearts: 1 },
            },
            { new: true }
        );
        res.status(200).json({ response: updatedThought, success: true });
    } catch (err) {
        res.status(400).json({
            response: "error",
            errors: err.errors,
            success: false,
        });
    }
});

// Start the server
app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Server running on http://localhost:${port}`);
});
