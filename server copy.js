import express from "express";
import cors from "cors";
import mongoose from "mongoose";
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts-api";
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
const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["Matilda", "Poya", "Petra", "Hanna", "Daniel", "Sandra"] //restricts to those allowed values
  },
  description: {
    type: String,
    minlength: 3,
    maxlength: 30,
    trim: true, //removes unnecessary whitespaces
  },
  score: {
    type: Number,
    default: 0 //initial value is used if no other value is specified
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});
const TechnigoMember =  mongoose.model("TechnigoMember",TechnigoMemberSchema)
// VERSION 1
app.post("/members", async (req, res) => {
  const { name, description } = req.body
  console.log(req.body)
  try {
    const newMember = await new TechnigoMember({ name: name, description: description}).save();
    res.status(201).json({success: true, response: newMember }) //201 = created
  } catch(error) {
    res.status(400).json({success: false, response: error})
  }
})
// VERSION 2 POST
app.post("/members", (req, res) => {
  const { name, description } = req.body
    const newMember = new TechnigoMember({ name: name, description: description}).save()
    .then(data => {
      res.status(201).json({success: true, response: data});
    }).catch(error => {
      res.status(400).json({success: false, response: error});
    })
})
// VERSION 3 mongoose syntax
app.post("/members", (req, res) => {
  const { name, description } = req.body
    const newMember = new TechnigoMember({ name: name, description: description}).save((error, data) => {
      if(error) {
        res.status(400).json({success: false, response: error});
      } else {
        res.status(201).json({success: true, response: newMember});
      }
    })
})
//GET => send items to the clients
//POST => create stuff
//PUT => replacing something in the database -> one person switch with another
//PATCH => change/modify individual stuff
app.patch("/members/:id/score", async (req, res) => {
  const { id } = req.params;
  try{
  const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}})
  res.status(200).json({success: true, response:`Member ${memberToUpdate.name} has their score updated`})
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
});
//THURSDAY
//Pagination 


//V1 // Mongoose Backend approach
app.get("/members", async (req, res) => {
  const {page, perPage} = req.query;
  try {
    const members = await TechnigoMembers.find({}).sort({createdAt: -1})
    .skip((page - 1) * perPage).limit(perPage);

    res.status(200).json({success: true, response: members});
  } catch (error) {
    res.status.apply(400).json({success: false, response: error});
  }
  });

  //V2 - Mongo Approach (how to deal with creating queries when you dont have access to the mongoose framework)
  app.get("/members", async (req, res) => {
  const { page, perPage, numberPage = +page, numberPerPage = +perPage } = req.query;
  try {
  const members = await TechnigoMember.aggregate([
    {
      $sort: {
        createdAt: -1
      }
    }, 
    {
      $skip: (page - 1) * perPage
    },
    {
      $limit: perPage
    }
  ]);
    res.status(200).json({success: true, response: members});
}
  catch (error) {
    res.status(400).json({success: false, response: error});
  }
});

app.delete("/members/:id", async (req, res) => {
  const { id } = req.params;
//Delete removes entry and returns the removed one
//Remove removes entry and returns true/false
try {
  const deletedMember = await TechnigoMember.findOneAndDelete({_id: id});
res.status(200).json({success: true, response: deletedMember})
} catch (error) {
  res.status(404).json({success: false, response: "not found"})
}
});
// Nesting schemas
const TestSchema = new mongoose.Schema({
  testProperty: {
    type: String
  },
  secondTestProperty: {
    type: Number,
    default: 8
  }
});

const SuperSchema = new mongoose.Schema({
  superTestProperty: {
    type: String
  },
  superSecondTestProperty: {
    type: Number,
    default: 8
  },
  lalalala: {
    type: TestSchema,
    required: true
  }
});

const SuperModel = mongoose.model("SuperModel", SuperSchema);
const superObject = new SuperModel({
  superTestProperty: "superTestProperty",
  superSecondTestProperty: 9,
  lalalala: {
    testProperty: "testProperty",
    secondTestProperty: 10
  }

})
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});