import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtSchema = new mongoose.Schema({
  message:{
    type: String,
    required: true, 
    minlength: 5, 
    maxlength: 140,
    trim: true // removes unnecessery white spaces
  } ,
  heart: {
    type: Number,
    default: 0
  }, 
  createdAt: {
    type: Date,
    default: () => new Date() // more universal way of making default that will not call the dunction imiditly 
  }
})

const Thought = mongoose.model("Thought", ThoughtSchema)

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
  res.send({"Welcome to Happy Thoughts API made by Kaja Wilbik!": "Using API you can: ",
  Routes: [{
    "GET: /thoughts": "allows to fetch data from the server",
    "POST: /thoughts": "allows to add new data to the server",
    "PATCH: /thoughts/:thoughtId/like": "allows to update like button"
  }]

})}
);

app.get("/thoughts", async (req, res)=> {
try{
  const allThought = await Thought.find().sort({createdAt: -1}).limit(20)
  res.status(200).json({
    success: true,
    response: allThought
  });
}catch (err) {
  res.status(400).json({
    success: false,
    response: `Cannot find wished data`,
    error: err
  })
}

})

app.post("/thoughts", async (req, res) => {
  const { message } = req.body
try{
  const newThought = new Thought({message})
  await newThought.save() // creating and saving newThought in database
  res.status(200).json({
    success: true,
    response: newThought
  });

}catch (error) {
  res.status(400).json({
    success: false,
    response: `Thought failed to add`,
    error: error
  })
}
  
})

// Patch allowes to find a specific though and updates likes increase after user in FE click on the heart
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
    const {thoughtId} = req.params;
      try { 
         const thoughtToUpdate = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
         res.status(200).json({
          sucess: true, 
          response: `Thought ${thoughtToUpdate.id} has their likes updated`
        });
      } catch (error) { res.status(400).json({
        success: false, 
        response: "id not found", 
        error: error
      })
    }});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
