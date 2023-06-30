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
  res.send("Time for some happy thoughts!");
});

const { Schema } = mongoose;
const FruitOrVegetableSchema = new Schema ({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  createdAt:{
    type: Date,
    default: new Date()
  },
  kind: {
    type: String,
    enum:["fruit", "vegetable"]
  }
})

const FruitOrVegetable = mongoose.model("FruitOrVegetable", FruitOrVegetableSchema)

app.post("/fruit_or_vegetable", async (req, res) => {
  const {kind, name, description} = req.body;
    try{
      const foodItem = await new FruitOrVegetable({kind, name, description}).save();
      res.status(201).json({
        success: true,
        response: foodItem
      })
    } catch (e) {
      res.status(400).json({
        success: false,
        response: e
      })
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
