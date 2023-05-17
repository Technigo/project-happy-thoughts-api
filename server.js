import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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
//////// TUESDAY

const { Schema } = mongoose;
const FruitOrVegetableSchema = new Schema({
  name: {
    // most important one
    type: String,
    // required true or false
    required: true,
    // only a new name that is different than all the others (that are already in the database) is allowed
    unique: true
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 40,
    // removes unnecessary whitespaces from string
    trim: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  kind: {
    type: String,
    // an array of all the allowed values
    enum:["fruit", "vegetable"] 
  }
});

const FruitOrVegetable = mongoose.model("FruitOrVegetable", FruitOrVegetableSchema);

app.post("/fruit_or_vegetable", async (req, res) => {
  const {kind, name, description} = req.body;
  try {
    const foodItem = await new FruitOrVegetable({kind, name, description}).save();
    res.status(201).json({
      success: true,
      response: foodItem,
      message: "error occured"
    });
  } catch (e) {
    res.status(404).json({
      success: false,
      response: e,
      message: "error occured"
    });
  }
});

// POST - create something
// PATCH - update
// PUT - replace
app.patch("/fruit_or_vegetable/:id", async (req, res) => {
  const { id } = req.params;
  // const newDescription = req.body.newDescription
  const  { newDescription } = req.body;
  try {
    const foodItem = await FruitOrVegetable.findByIdAndUpdate(id, {description: newDescription });
    res.status(200).json({
      success: true,
      response: foodItem,
      message: "updated successfully"
    });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not updated successfully"
    });
  }
});


//modify when nothing found
app.get("/fruit_or_vegetable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const foodItem = await FruitOrVegetable.findById(id);
    res.status(200).json({
      success: true,
      response: foodItem,
      message: "found successfully"
    });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not updated successfully"
    });
  }
});

// delete

app.delete("/fruit_or_vegetable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const foodItem = await FruitOrVegetable.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      response: foodItem,
      message: "deleted successfully"
    });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not updated successfully"
    });
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
