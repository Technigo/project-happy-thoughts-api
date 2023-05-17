import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-happy-thoughts-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

const { Schema } = mongoose;
const HappyThoughtsSchema = new Schema({
  message: {
    // type is the most important one
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    // removes unnecessary whitspaces from string
    trim: true
  },
  hearts: {
    type: Number,
    default: 0,
    set: function (value) {
    return 0
    }
  },
  createdAt: {
    type: Date, 
    default: new Date()
  }
})

const HappyThoughts = mongoose.model("HappyThoughts", HappyThoughtsSchema);

app.post("/thoughts", async (req, res) => {
  const { message, hearts, createdAt } = req.body;
    try {
      const thought = await new HappyThoughts({message, hearts, createdAt}).save();
      res.status(201).json({
        success: true,
        response: thought,
        message: "thought created successfully"
      })
    } catch (e) {
      res.status(400).json({
        success: false,
        response: e,
        message: "error occured when creating thought"
    })
  }
})

app.get("/thoughts/", async (req, res) => {
  const { id } = req.params;
    try {
      const foodItem = await FruitOrVegetable.findById(id)
      res.status(200).json({
        success: true,
        response: foodItem,
        message: "thought found successfully"
      })
    } catch(e) {
      res.status(400).json({
        success: false,
        response: e,
        message: "error occured when searching for thought"
    })
  }
})

// POST - create something
// PATCH - update something
// PUT - replace something

app.patch("/fruit_or_vegetable/:id", async (req, res) => {
  const { id } = req.params;
  const { newDescription } = req.body;
    try {
      const foodItem = await FruitOrVegetable.findByIdAndUpdate(id, {description: newDescription})
      res.status(200).json({
        success: true,
        response: {},
        message: "updated successfully"
      })
    } catch(e) {
      res.status(400).json({
        success: false,
        response: e,
        message: "error occured"
    })
  }
})

app.get("/fruit_or_vegetable/:id", async (req, res) => {
  const { id } = req.params;
    try {
      const foodItem = await FruitOrVegetable.findById(id)
      res.status(200).json({
        success: true,
        response: foodItem,
        message: "found successfully"
      })
    } catch(e) {
      res.status(400).json({
        success: false,
        response: e,
        message: "error occured"
    })
  }
})

app.delete("/fruit_or_vegetable/:id", async (req, res) => {
  const { id } = req.params;
    try {
      const foodItem = await FruitOrVegetable.findByIdAndRemove(id)
      res.status(200).json({
        success: true,
        response: foodItem,
        message: "deleted successfully"
      })
    } catch(e) {
      res.status(400).json({
        success: false,
        response: e,
        message: "error occured"
    })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
