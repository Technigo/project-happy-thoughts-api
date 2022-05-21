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
////////////////////

const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    // most important one
    type: String,
    required: true,
    unique: true,
    enum:["Karin", "Petra", "Matilda", "Poya", "Daniel"]
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 30,
    // deletes whitespace from beginning and end of a string               lala lala        
    trim: true
  },
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: ()=> new Date()
  }
});
// mongoose.Model
// mongoose.model

// const array = [];
// Array

const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema);

//// POST request V1
app.post("/members", async (req, res) => {

  const { name, description } = req.body;
  console.log(req.body);
  try {
    const newMember = await new TechnigoMember({name: name, description: description}).save();
    
    res.status(201).json({response: newMember, success: true});
  } catch(error) {

    res.status(400).json({response: error, success: false});
  }

});

//// POST with promises
// app.post("/members", (req, res) => {

//   const { name, description } = req.body;
//   console.log(req.body);

// new TechnigoMember({name: name, description: description}).save()
//   .then(data => {
//     res.status(201).json({response: data, success: true});
//   }).catch(error => {
//     res.status(400).json({response: error, success: false});
//   });
// });

//// V3
// app.post("/members", (req, res) => {

//   const { name, description } = req.body;

//   new TechnigoMember({name: name, description: description}).save((error, data) => {
//     if (error) {
//       res.status(400).json({response: error, success: false});
//     } else {
//       res.status(201).json({response: data, success: true});
//     }
//   });
// });

//// POST -> creating
///PUT -> replaces 
////PATCH -> changes

app.post("/members/:id/score", async (req, res) => {
  const { id } = req.params;
  try {
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}});
    res.status(200).json({response: `Member ${memberToUpdate.name} has been updated`, succes: true});
  } catch (error) {
    res.status(400).json({response: error, succes: false});
  }
});
//////////////////
//// Wednesday

app.get("/members", async (req, res) => {
  // const members = await TechnigoMember.find({});

  // V1 -mongoose
  // const {page, perPage} = req.query; 
  // try {
  //   const members = await TechnigoMember.find({}).sort({createdAt: 1}) //1 ascending -1 descending //Sort the mongoose way
  //   .skip((page - 1) * perPage).limit(perPage);

  //   res.status(200).json({success: true, response: members});
  // } catch (error) {
  //   res.status(400).json({success: false, response: error});
  // }
  
/// V2 Mongo
const { page, perPage, numPage = +page, numPerPage = +perPage } = req.query; 
  try {
    const members = await TechnigoMember.aggregate([
      {
        $sort: {
          createdAt: -1
        }
      },
      {
        $skip: (numPage -1) * numPerPage
      },
      {
        $limit: numPerPage
      }
    ]);
    // .skip((page - 1) * perPage).limit(perPage);

    res.status(200).json({success: true, response: members});
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
  
});
app.delete("/members/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    // const deleted = await TechnigoMember.deleteOne({_id: id}); //Gives us only true/that we deleted something 
    const deleted = await TechnigoMember.findOneAndDelete({_id: id}); //Gives us who we deleted - This one is encouraged to use. 
    if(deleted) {
      res.status(200).json({success: true, response: deleted})
    } else {
      res.status(404).json({succes: false, response: "Not found"});
    }
  } catch (error) {
    res.status(400).json({succes: false, response: error});
  }

});

/////////


app.patch("/members/:id", async (req, res) => {
  const { id } = req.params;
  const { updatedName } = req.body;

  try {
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate({_id: id}, {name: updatedName});
    if(memberToUpdate) {
      res.status(200).json({success: true, response: memberToUpdate});
    } else {
      res.status(404).json({succes: false, response: "Not found"});
    }
  } catch (error) {
    res.status(400).json({succes: false, response: error});
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
