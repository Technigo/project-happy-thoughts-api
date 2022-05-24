import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

//mongoose schema

const ThoughtSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   enum: ["Karin", "Petra", "Matilda", "Poya", "Daniel"]
  // },
  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true
    // trim: true,
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

 
const Thought = mongoose.model("Thought", ThoughtSchema);

//POST request 
app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  
  try {
    const newThought = await new Thought({message: message}).save()
    
    res.status(201).json({response: newThought, success: true});
  } catch(error) {
    res.status(400).json({response: error, success: false});
  }
});


//SCORE ==> LIKE
app.post("/thoughts/:thoughtId/like", async (req, res) => {
  const { hearts } = req.params;
  try {
    const thoughtToUpdate = await Thought.findByIdAndUpdate(id, {$inc: {score: 1}});
    res.status(200).json({response: `Thought ${thoughtToUpdate.hearts} has gotten a like`, success: true});
  } catch (error) {
    res.status(400).json({response: error, success: false});
  }
});

//Mongoose GET
app.get("/thoughts", async (req, res) => {
  const { page, perPage } = req.query;

  try {
    const thoughts = await Thought.find({}).sort({createdAt: -1})
      .skip((page - 1) * perPage).limit(perPage);
    res.status(200).json({success: true, response: thoughts});

  } catch (error) {
    res.status(400).json({success: false, response: error});
  }

});



//delete

app.delete("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  
  try{
    const deleted = await Thought.findOneAndDelete({_id: id});
    if(deleted) {
      res.status(200).json({success: true, response: deleted});
    } else {
      res.status(404).json({success: false, response: "thought not found"});
    }
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }

});

//update

app.patch("/thoughts/:id", async (req, res) => {
  const { id } = req.params;
  const { updatedThought } = req.body;

  try {
    const ThoughtToUpdate = await Thought.findByIdAndUpdate({_id: id}, {hearts: updatedThought});
    if(ThoughtToUpdate) {
      res.status(200).json({success: true, response: ThoughtToUpdate});
    } else {
      res.status(404).json({success: false, response: "thought not found"});
    }
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }

});



// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Happy Tweets!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});









//other versions


//Mongo GET
// app.get("/members", async (req, res) => {
//   const { page, perPage, } = req.query;

//   try {
//     const members = await TechnigoMember.aggregate([
//       {
//         $sort: {
//           createdAt: -1
//         }
//       },
//       {
//         $skip: (numPage - 1) * perPage
//       },
//       {
//         $limit: numPerPage
//       }
//     ]);

//     res.status(200).json({success: true, response: members});
//   } catch (error) {
//     res.status(400).json({success: false, response: error});
//   }
// });

//POST request version two with promises
// app.post("/members", (req, res) => {
  
//     const { name, description } = req.body;
    
//       new TechnigoMember({name: name, description: description}).save()
//         .then(data => {
//           res.status(201).json({response: data, success: true});
//         }).catch(error => {
//           res.status(400).json({response: error, success: false});
//         });
        
//   });

  //POST request version three
  // app.post("/members", async (req, res) => {
  
  //     const { name, description } = req.body;
      
  //     new TechnigoMember({name: name, description: description}).save((error, data) => {
  //       if (error) {
  //         res.status(400).json({response: error, success: false});
  //       } else {
  //         res.status(201).json({response: data, success: true});
  //       }
  //     });
    
  // });