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

//Testing, difference between schema and model?
//Schema
const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    //most important one
    type: String,
    required: true,
    unique: true,
    enum: ["Karin", "Petra", "Matilda","Poya", "Daniel"]
  }, 
  description: {
    type: String,
    minlength: 4,
    maxlength: 30,
    // deletes whitespace from beginning and the end of a string
    trim: true
  },
  Score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: ()=> new Date()
  } 
})

//model
const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema)

// POST request
app.post("/members", async(req, res)=> {
  const { name, description } = req.body
  console.log(req.body)
  try {
    const newMember = await new TechnigoMember({ name: name, description: description}).save()
    res.status(200).json({response: newMember, sucess: true})
  } catch(error) {

    res.status(400).json({response: error, sucess: false})
  }
})

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
