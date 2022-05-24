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

const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["Karin", "Petra", "Matilda", "Poya", "Daniel"]
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 30,
    trim: true
  },
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

 
const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema);

//POST request 
app.post("/members", async (req, res) => {
  const { name, description } = req.body;
  
  try {
    const newMember = await new TechnigoMember({name: name, description: description}).save()
    
    res.status(201).json({response: newMember, success: true});
  } catch(error) {
    res.status(400).json({response: error, success: false});
  }
});


//SCORE ==> LIKE
app.post("/members/:id/score", async (req, res) => {
  const { id } = req.params;
  try {
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}});
    res.status(200).json({response: `Member ${memberToUpdate.name} has been updated`, success: true});
  } catch (error) {
    res.status(400).json({response: error, success: false});
  }
});

//Mongoose GET
app.get("/members", async (req, res) => {
  const { page, perPage } = req.query;

  try {
    const members = await TechnigoMember.find({}).sort({createdAt: -1})
      .skip((page - 1) * perPage).limit(perPage);
    res.status(200).json({success: true, response: members});

  } catch (error) {
    res.status(400).json({success: false, response: error});
  }

});

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

//delete

app.delete("/members/:id", async (req, res) => {
  const { id } = req.params;
  
  try{
    const deleted = await TechnigoMember.findOneAndDelete({_id: id});
    if(deleted) {
      res.status(200).json({success: true, response: deleted});
    } else {
      res.status(404).json({success: false, response: "member not found"});
    }
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }

});

app.patch("/members/:id", async (req, res) => {
  const { id } = req.params;
  const { updatedName } = req.body;

  try {
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate({_id: id}, {name: updatedName});
    if(memberToUpdate) {
      res.status(200).json({success: true, response: memberToUpdate});
    } else {
      res.status(404).json({success: false, response: "member not found"});
    }
  } catch (error) {
    res.status(400).json({success: false, response: error});
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