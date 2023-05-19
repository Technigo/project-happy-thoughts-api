import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
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
  res.send({
    responseMessage: "Happy Thoughts API by Yu Miao",
    endpoints:
    {
      "/thoughts":"display all happy thoughts max 20",
      "/thoughts/:thoughtId/like":"like a post by inreasing the hearts by 1",
    }
  });
});

//thoughs model
const { Schema } = mongoose;
const ThoughtSchema = new Schema ({
  message : {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type : Date,
    default: new Date()
  }
});

const ThoughtList = mongoose.model("Thought", ThoughtSchema)
// Endpoints 1 : GET/thoughts, all happy thoughts max 20
app.get("/thoughts", async(req,res) => {
  try {
    const thoughts = await ThoughtList.find().sort({createdAt:"desc"}).limit(20).exec()
    res.status(201).json({
      success: true,
      response: thoughts,
      message: "created successfully"
    })

  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "error occured"
    });

  }

})
// Endpoint 2: POST/thoughts, create a happy thoughts
app.post("/thoughts", async(req,res)=>{
  const { message } = req.body
  try {
  const newThought = await new ThoughtList({message}).save()
    res.status(201).json({
      success: true,
      response: newThought,
      message: "post successfully"
    })

  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "can not post your thought"
    });
  }

})
//Endpoint 3: POST/thoughts/:thoughtId/like, like a post by inreasing the hearts by 1
app.post("/thoughts/:thoughtId/like", async(req,res) => {
  const { id } = req.params;
  try {
    const heartsToUpdate = await ThoughtList.findByIdAndUpdate(id, {$inc: { hearts: 1 }})
    res.status(200).json({
      success: true,
      response: heartsToUpdate,
      message: "like updated successfully "
     });
  } catch (e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "could not update the hearts, invalid request"
     });

  }
})
 

// Delete a post
// app.delete("/thoughts/:thoughtsId", async (req, res) => {
//   const { thoughtId } = req.params
//   try {
//     const deletedthoughtId = await ThoughtList.findByIdAndDelete({_id: thoughtId}) 
//     res.status(200).json({
//       success: true,
//       response: deletedthoughtId,
//       message: "delete successfully "
//      });

//   } catch (e) {
//   res.status(400).json({
//     success: false,
//     response: e,
//     message: "could not delete the post"
//     });
//   }
// })




// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
