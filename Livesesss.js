import express, { response } from "express";
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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});
////////////////
const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    // most important one
    type: String,
    // forces to provide this value
    required: true,
    // new name will have to be different than all others in the DB
    unique: true,
    // all the allowed values
    enum: ["Matilda", "Poya", "Petra", "Hanna", "Daniel"]
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 30,
    // removes unnecessary whitespaces
    trim: true
  },
  score: {
    type: Number,
    // initial value, if none other is specified
    default: 0
  },
  createdAt: {
    type: Date,
    // new Date() will execute once - when we start the server
    // default: new Date()
    // onClick = { someFunction()}
    // IIFE - in the moment that you declare the function it is called/executed right away
    // (() => new Date())()
    // (function functionName () {new Date()})()
    default: () => new Date()
  }
});

const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema);

// V1
// app.post("/members", async (req, res) => {
//   const {name, description} = req.body;
//   console.log(req.body);
//   try {
//     const newMember = await new TechnigoMember({name: name, description: description}).save();
//     res.status(201).json({success: true, response: newMember});
//   } catch(error) {
//     res.status(400).json({success: false, response: error});
//   }
// });



// V2 POST with promises
app.post("/members", (req, res) => {
  const {name, description} = req.body;
    const newMember = new TechnigoMember({name: name, description: description}).save()
      .then(data => {
        res.status(201).json({success: true, response: data});
    }).catch(error => {
        res.status(400).json({success: false, response: error});
    });
});

// V3 POST mongoose syntax
// app.post("/members", (req, res) => {
//   const {name, description} = req.body;
//     const newMember = new TechnigoMember({name: name, description: description}).save((error, data) => {
//       if(error) {
//         res.status(400).json({success: false, response: error});
//       } else {
//         res.status(201).json({success: true, response: data});
//       } 
//     });
// });

// POST => create stuff
// PUT => replace in DB -> one PErson switch with another
// PATCH => change/modify stuff
app.patch("/members/:id/score", async (req, res) => {
   const { id } = req.params;
   try {
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}});
    res.status(200).json({success: true, response: `Member ${memberToUpdate.name} has their score updated`});
   } catch (error) {
    res.status(400).json({success: false, response: error});
   }
});
///////////////
////// Thursday /////
/// Pagination ////

app.get("/members", async (req, res) => {
  // const members = await TechnigoMember.find({});
  /// V1 mongoose ///
  // const {page, perPage} = req.query;
  // try {
  //   const members = await TechnigoMember.find({}).sort({createdAt: -1})
  //   .skip((page - 1) * perPage).limit(perPage)
  //   // Items are sorted, so we are always skipping the same, pages do not differ based on variance
  // //  case 1 == page is 1, perPage is 10
  // //  .skip( 1 - 1) == 0; 0*10 == 0 => skip(0) => not skipping anything; 
  // // .limit(10) => we are returning 10 items, not skipping anything, first 10 items are returned; 
  // //  case 2 == page is 2, perPage is 10
  // //  .skip( 2 - 1) == 1; 1*10 == 10 => skip(10) => skipping 10 items == skipping the first page; 
  // // .limit(10) => we are returning 10 items, skipping the first page, second 10 items are returned; 
 
  //   res.status(200).json({success: true, response: members});
  // } catch (error) {
  //   res.status(400).json({success: false, response: members});
  // }
 // V2 Mongo
 const { page, perPage, numberPage = +page, numberPerPage = +perPage } = req.query;
 try {
   const members = await TechnigoMember.aggregate([
     {
       $sort: {
         createdAt: -1
       }
     },
     {
       $skip: (numberPage - 1) * numberPerPage
     },
     {
       $limit: numberPerPage
     }
   ]);
   res.status(200).json({success: true, response: members});
 }
catch (error) {
   res.status(400).json({success: false, response: error});
 }
});
app.delete("/members/:id", async (req, res) => {
  const {id} = req.params
  try{
    const deletedMember = await TechnigoMember.findOneAndDelete({_id:id})
    res.status(200).json(deletedMember)
  }catch (error) {
    res.status(400).json(error)
  }
})
/// Nesting Schemas
const TestSchema = new mongoose.Schema({
  testProperty: {
    type: String,
  },
  secondTestPropery: {
    type: Number,
    default: 8
  }
});
const SuperSchema = new mongoose.Schema({
  superTestProperty: {
    type: String,
  },
  superSecondTestPropery: {
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
  superSecondTestPropery: 9,
  lalalala: {
    testProperty: "testProperty",
    secondTestPropery: 10
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


