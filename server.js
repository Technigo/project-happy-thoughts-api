import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happyThoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const ThoughtSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true,
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  },
});

const Thought = mongoose.model("Thought", ThoughtSchema);

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hi there, this is the backend version of the Happy Thoughts project")
});

app.get('/thoughts', async (req, res) => {
// v1 - Mongoose
  const { page } = req.query;
  try {
   const thoughts = await Thought.find({})
     .sort({ createdAt: -1 })
     .skip((page - 1) * 20).limit(20);
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
          error: 'ID not foud ',
          success: false,
        })
      }
    } catch (err) {
      res.status(400).json({
        error: 'Invalid ID',
        success: false,
      })
    }
  })

  // v2 - Mongo
  // const members = await Member.aggregate([
  //   {
  //     $sort: {
  //       createdAt: 1
  //     }
  //   },
  //   {
  //     $skip: (pageNum - 1) * perPage
  //   },
  //   {
  //     $limit: perPageNum,
  //   },
  // ]);

 

// v1 - async await
app.post("/members", async (req, res) => {
  const { name, description } = req.body;

  try {
    const newMember = await new Member({ name: name, description: description }).save();
    res.status(201).json({ response: newMember, success: true });
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});

// v2 - promises
// app.post("/members", (req, res) => {
//   const { name, description } = req.body

//   new Member({ name, description }).save()
//   .then(data => {
//     res.status(201).json({response: data, success: true });
//   })
//   .catch(error => {
//     res.status(400).json({response: error, success: false});
//   })
// });

// v3 - mongoose callback
// app.post("/members", (req, res) => {
//   const { name, description } = req.body;

//   new Member({ name, description }).save((error, data) => {
//     if (error) {
//       res.status(400).json({response: error, success: false});
//     }
//     else {
//       res.status(201).json({response: data, success: true });
//     }
//   })

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



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
