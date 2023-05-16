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
const ThoughtsSchema = new Schema({
  message: {
   type: String,
   required: true,
   minlength: 4,
   maxlength: 20
},
 createdAt: {
  type: Date,
  default: new Date()
 }, 
 hearts: {
  type: Number,
  default: 0
 }
});

const Thoughts = mongoose.model("Thoughts", ThoughtsSchema);

// GET - a thought, modify when nothing found
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await HappyThoughts.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json({
      success: true,
      response: thoughts,
      message: "Thoughts retrieved successfully"
    });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not successfully"
     });
  }
});

//POST-create something
app.post("/thoughts", async (req, res) =>{
  const {message} = req.body;
  try {
    const newThought = await new HappyThoughts({message}).save();
    res.status(201).json({
      success: true,
      response: newThought,
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

app.post("thoughts/:thoughtId/like", async (req, res)=>{
  const {id} = req.body;
  try{
        const likes = await new HappyThoughts({id}).save();
        res.status(201).json({
          success: true,
          response: likes,
           message: "created successfully"
         });
       } catch (e) {
         res.status(400).json({
          success: false,
          response: e,
          message: "error occured"
        });
      }
   });

//PATCH- to update
app.patch("/thoughts/:id", async (req,res) => {
 const { id } = req.params;
 try {
 const thought = await Thoughts.findById(id);
 res.status(200).json({
  success: true,
  response: thought,
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


// app.get("/thought/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const thought= await Thoughts.findById(id);
//     res.status(200).json({
//       success: true,
//       response: thought,
//       message: "found successfully"
//      });
//   } catch(e) {
//     res.status(400).json({
//       success: false,
//       response: e,
//       message: "did not successfully"
//      });
//   }
// });

// delete
app.delete("/thought/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const thought = await Thoughts.findByIdAndRemove(id);
    res.status(200).json({
      success: true,
      response: thought,
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
