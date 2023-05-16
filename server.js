import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


//In order to store the database we need a database model 
const { Schema } = mongoose;
const HappyThoughtsSchema = new Schema({
  text: {
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
 heart: {
  type: Number,
  default: 0
 },
 kind: { //array of all the allowed values
  type: String,
  enum: ["Thoughts", "Emojis"]
 }

});

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


const HappyThoughts = mongoose.model("HappyThoughts", HappyThoughtsSchema);

app.get("/HappyThoughts", async(req, res) => {
  const allThoughtsData = await HappyThoughts.find()
  try {
    const happyThought = await HappyThoughts.aggregate([
      { $sort: { createdAt: -1 } },
    ])
    if(happyThought){
      res.status(200).json({
        success: true,
        message: "OK",
        body: {
          result: HappyThoughts,
        }
      })
    } else {
      res.status(404).json({ error: "No HappyThoughts found" })
    }}
    catch(err){
      res.status(400).json({ message: "Request failed", error: err })
    }
  })

app.post("/HappyThoughts", async (req, res) =>{
  const {kind, text, description} = req.body;
  try {
    const happyThought = await new HappyThoughts({kind, text, heart}).save();
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
 try {
 const happyThought = await HappyThoughts.findById(id);
 res.status(200).json({
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

// modify when nothing found
app.get("/HappyThought/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const happyThought= await HappyThoughts.findById(id);
    res.status(200).json({
      success: true,
      response: happyThought,
      message: "found successfully"
     });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not successfully"
     });
  }
});

// delete
app.delete("/HappyThought/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const happyThought = await HappyThoughts.findByIdAndRemove(id);
    res.status(200).json({
      success: true,
      response: happyThought,
      message: "deleted successfully"
     });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not successfully"
     });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
