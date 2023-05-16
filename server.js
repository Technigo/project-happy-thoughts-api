import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/happy-thoughts-Irupe";
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
////// Tuesday ////

const { Schema } = mongoose;
const HappyThoughtsSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5, 
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0 

  },
  createdAt: {
    type: Date,
    default: new Date()
  },
}); 

const HappyThoughts = mongoose.model("HappyThoughts", HappyThoughtsSchema);

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


app.post("/thoughts", async (req, res)=>{
const {message} = req.body;
try{ 
      const newThoughts = await new HappyThoughts({message}).save();
      res.status(201).json({
        success: true,
        response: newThoughts,
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

 // POST thoughts/:thoughtId/like
 app.post("/thoughts/:thoughtId/like", async (req, res) => {
  try {
    const likes = await HappyThoughts.findOneAndUpdate(
      { "_id": req.params.thoughtId }, // Corrected parameter name
      { $inc: { "hearts": 1 } },
      { new: true }
    );
    res.status(201).json(likes);
  } catch (err) {
    res.status(400).json({ message: "Could not save your like", error: err.errors });
  }
});

/*app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  //id from url :param
  const { thoughtId } = req.params;
  // if id is found increases heart count by one
  try {
    const liked = await Thought.findByIdAndUpdate(thoughtId,{ $inc: { heart: 1 } });
    res.status(200).json(liked);
  } catch (e) {
    res.status(400).json({
      success: false,
      message: 'Could not like thought',
      error: e});
  };
});*/
 /* app.post("thoughts/:thoughtId/like", async (req, res)=>{
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
   });*/



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
