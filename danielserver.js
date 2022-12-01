/* import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || `mongodb+srv://Paprika:${process.env.STRING_PW}@cluster0.6gvgrxz.mongodb.net/project-happy-thoughts-api?retryWrites=true&w=majority`;
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
})

//// Pagination ////
app.get("/members", async (req, res) => {
  // const members = await TechnigoMember.find({})
  //V1 mongoose
  const {page, perPage} = req.query;
  try{
    const members = await TechnigoMember.find({}).sort({createdAt: -1}).skip((page -1) * perPage).limit(perPage);
    //case 1 page is 1, perPage is 10
    // skip(1-1) == 0; 0*10 == 0 => skip(0) => not skipping anything; .limit(10) => we are returning 10 items, not skipping anything
    //first 10 items are returned

    //case 2 page = 2, perPage = 10
    // skip(2-1) == 0; 0*10 == 0 => skip(10) => skipping the first page; .limit(10) => we are returning 10 items, skipping the first page
    //second 10 items are returned

    //case 3 page = 43, perPage = 10
    // skip(43-1) == 42; 42*10 == 420 => skip(420) => skipping 420 items; .limit(10) => we are returning 10 items, skipping the first 42 pages, the 43rd 10 items are returned
    //second 10 items are returned
    res.status(200).json({success: true, response: members});
  } catch (error) {
    res.status(400).json({success: false, response: error})
  }

  //Mongoose
  const { page, perPage, numberPage = +page, numberPerPage = +perPage } = req.query;
  try {
  const members = await TechnigoMember.aggregate([
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $skip: (page - 1) * numberPage
    },
    {
      $limit: numberPerPage
    }
  ])
  res.status(200).json({success: true, response: members});
  } 
  catch (error) {
    res.status(400).json({success: false, response: error})
  }
});

//http://localhost:8080/members?page=2&perPage=1

app.delete("/members/:id"), async (req, res) => {
  const { id } = req.params
  // Delete removes entry and returns the removed one
  // Remove removes entry and return true/false
  try{
  const deletedMember = await TechnigoMember.findOneAndDelete({_id: id});
  if (deletedMember) {
  res.status(200).json({success: true, response: deletedMember})
  } else {
  res.status(404).json({success: false, response: "not found"})  
  }
  } 
  } catch (error) {
  res.status(400).json({success: false, response: error})  
  }
}); 

// Nesting Schemas
const SuperSchema = new mongoose.Schema({
  superTestProperty: {
    type: String
  },
  superSecondTestProperty: {
    type: Number,
    default: 8
  },
  lalala: {
    type: TestSchema,
    required:
  }
});

const SuperModel = mongoose.model("SuperModel", SuperSchema)
const superObject = new SuperModel({
  superTestProperty: "superTestProperty",
  superSecondTestProperty: 9,
  lalala: {
    testProperty: "testProperty",
    secondTestProperty: 10
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
 */