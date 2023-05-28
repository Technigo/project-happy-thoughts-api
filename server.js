import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy";
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

// Start defining your routes here.
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

const { Schema } = mongoose;

//Thoughts 
const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    // so as to hinder spam:
    unique: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30
  },
  
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
  topic: {
    type: String,
    // array of all of the allowed values 
    enum: ["poetry", "quote"]
  }
});

const Thought = mongoose.model("Thought", ThoughtSchema);

app.get("/thoughts", async (req, res) => {
  const thoughts = await Thought.find().sort({createdAt: 'desc'}).limit(20).exec() 
  // 1. Thought.find() asks for all documents (thoughts) without any specific filter. 
  // 2. .sort({createdAt: 'desc'}) sorts the retrieved thoughts based on createdAt-field in descending order, so the most recent thoughts goes on top. 
  // 3. .limit(20) limits the number of thoughts returned to 20. Only the latest 20 thoughts are retreived. 
  // 4. .exec() executes the query
  try {  
    res.status(200).json({ //sets the response status code to 200 and prepares the response as a json object
      success: true,
      response: thoughts, //this is where the thoughts are store, that's why I needed to changes the code in the original Happy Thoughts-project, the structure is different from the original API
      message: "Sucessfully fetched messages."
    })
  } catch (e) {
    res.status(400).json({
      success: false, 
      response: e, //includes the error object and message caught in the catch block. 
      message: "Bad request, couldn't fetch thoughts",
      error: e.message
    })
  }
})

app.post("/thoughts", async (req, res) => {
 const {message, name, topic } = req.body;

  try{
    const thoughtItem = await new Thought({message: message, name: name, topic: topic}).save();
    res.status(201).json({
      success: true,
      response: thoughtItem,
      message: "created succesfully"
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "error occurred"
    })   
  }
})

// before async available in Node, old code using promises & then blocks
/*
app.post("/thoughts", async (req, res) => {
 const {message, name, topic } = req.body; 
 const thoughtItem = new Thought({message: message, name: name, topic: topic}).save()
  .then(item => {
    res.status(201).json({
      success: true,
      response: item,
      message: "created succesfully"
    })
  }).catch(e => {
    res.status(201).json({
     success: false,
     response: e,
     message: "error occurred"    
  })
})
})
*/

//requests to modify data inside database 
//POST - create something
//PATCH - update something
//PUT - replace something


app.patch("/thoughts/:id", async (req,res) => {
  const { id } = req.params;
  const NewName = req.body.NewName;
  try {
    const thoughtItem = await Thought.findByIdAndUpdate(id, {name: NewName });
    res.status(201).json({
      success: true,
      response: {},
      message: "modified succesfully"
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "error occurred"
    })   
  }
});


app.post('/thoughts/:_id/like', async (req, res) => {
  try {
    const singleThought = await Thought.findById(req.params._id);
    if (singleThought) {
      singleThought.hearts += 1;
      await singleThought.save();
      res.status(200).json({
        success: true,
        message: "Hearts plus one",
        singleThought: singleThought
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
        message: "Faulty ID"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
      message: "Server error",
      error: e
      }
    })
  }
});


app.get("/thoughts/:id", async (req,res) => {
  const { id } = req.params;
  try {
    const thoughtItem = await Thought.findById(id);
    res.status(201).json({
      success: true,
      response: thoughtItem,
      message: "found by id"
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "error occurred"
    })   
  }
});

app.delete("/thoughts/:id", async (req,res) => {
  const { id } = req.params;
  try {
    const thoughtItem = await Thought.findByIdAndDelete(id);
    res.status(201).json({
      success: true,
      response: thoughtItem,
      message: "deleted succesfully"
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "error occurred"
    })   
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
