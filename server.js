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
////////////////////////
const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    // type: most important one
    type: String,
    // required: forces to provide this value
    required: true,
    // unique: new name will have to be different than all others in the DB
    unique: true,
    // enum: all the allowed values 
    enum: ["Charlotte", "Markus", "Sigrid"]
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 30,
    // trim: removes unnecessary whitespaces
    trim: true
  },
  score: {
    type: Number,
    // dafault: initial value, if none other is specified
    default: 0
  },
  createdAt: {
    type: Date,
    // new Date() will execute once - then we start the server
    // default: new Date()
    // x
    default: () => new Date()
  }
});

const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema);

app.post("/members", async (req, res) => {
  const {name, description} = req.body;
  console.log(req.body);
  try {
    const newMember = await new TechnigoMember({name: name, description: description}).save();
    res.status(201).json({success: true, response: newMember})
  } catch(error) {
    res.status(400).json({success: false, response: error});
  }
});



////////////////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
