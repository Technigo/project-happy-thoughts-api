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

// Start defining your routes here (endpoints)
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

//In order to store the database we need a database model 
const { Schema } = mongoose;
const HappyThoughtsSchema = new Schema({
  name: {
   type: String,
   required: true,
   unique: true,
},
 description: {
  type: String,
  minlength: 4,
  maxlength: 20,
  trim: true  //removes unnecessary whitespaces from string
 },
 createdAt: {
  type: Date,
  default: new Date()
 }, 
 kind: { //array of all the allowed values
  type: String,
  enum: ["Thoughts", "Emojis"]
 }

});

const HappyThoughts = mongoose.model("HappyThoguhts", HappyThoughtsSchema);

app.post("/HappyThoughts", async (req, res) =>{
  const {kind, name, description} = req.body;
  try {
    const happyThought = await new HappyThoughts({kind, name, description}).save();
    res.status(201).json({
      success: true,
      response: happyThought,
      message: "Created successfully"
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "Error occured"
    });
  }
});
//POST-create something
//PATCH-update
//PUT-replace

app.patch("/HappyThoughts/:id", async (req,res) => {
 const { id } = req.params;
 const newDescription = req.body.newDescription;
 try {
 const happyThought = await HappyThoughts.findByIdAndUpdate(id, {description: newDescription})
 res.status(201).json({
  success: true,
  response: happyThought,
  message: "Created successfully"
});
 } catch(e) {
  res.status(400).json({
    success: false,
    response: e,
    message: "Error occured"
  });
 }

});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
