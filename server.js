import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: ()=> new Date()
  },
});
// Below is a model called Thought which uses the schema above.
const Thought = mongoose.model('Thought', ThoughtSchema); 


const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello! This is the backend-part of a previous project called Happy Thoughts.");
});

app.get('/thoughts', async (req, res) => { 
//V1 Mongoose 
  const { page, perPage } = req.query;
  try {
    const thoughts = await Thought.find({})
    .sort({createdAt: -1})
    .skip((page -1) * perPage).limit(perPage);
    res.status(200).json({success: true, response: thoughts});
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
});

app.get('/thoughts/:thoughtId', async (req, res) => {
  try {
    const fetchId = await Thought.findOne({_id: req.params.thoughtId});
    if(fetchId) {
      res.status(200).json({
        data: fetchId,
        success: true,
      })
    } else {
      res.status(404).json({
        error: 'bookID not found',
        success: false,
      })
    }
  } catch (err) {
    res.status(400).json({
      error: 'Invalid bookID',
      success: false,
    })
  }
})

//V2 Mongo with query
// const { page, perPage, numPage = +page, numPerPage = +perPage } = req.query;
// try {
//   const thoughts = await Thought.aggregate([
//     {
//       $sort: {
//         createdAt: -1
//       }
//     },
//     {
//       $skip: ( numPage - 1) * numPerPage
//     },
//     {
//       $limit: numPerPage
//     }
//   ]);

//   res.status(200).json({success: true, response: thoughts});
// } catch (error) {
//   res.status(400).json({success: false, response: error});
// }
// });

app.post('/thoughts', async (req, res) => {
  const { message } = req.body;

  try {
    const newThought = await new Thought({ message: message}).save()
    res.status(201).json({
      response: newThought,
      success: true
    });
  } catch (error) { 
    res.status(400).json({
      response: 'Could not save message',
      success: false
    });
  }
});

app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const updatedLikes = await Thought.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}});
    res.status(200).json({
      response: updatedLikes,
      success: true}); 
  } catch (error) {
    res.status(400).json({
      response: error,
      success: false});
  }
});

app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const deleted = await Thought.findOneAndDelete({_id: id});
    if (deleted) {
      res.status(200).json({success:true, response: deleted});
    } else {
      res.status(404).json({success: false, response: "Not Found"});
    }
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
});

app.patch("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  const { updatedThought} = req.body;

  try {
    const updatedMessage = await Thought.findByIdAndUpdate({_id: id}, {message: updatedThought})
    if (updatedMessage) {
      res.status(200).json({
        success: true, 
        response: updatedMessage
      });
    } else {
      res.status(404).json({
        success: false, 
        response: "Not found"
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      response: error
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
