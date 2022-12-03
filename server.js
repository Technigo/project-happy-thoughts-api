import express, { text } from "express";
import cors from "cors";
import mongoose from "mongoose";

//only connected to local database 
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
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



const ThoughtsSchema = new mongoose.Schema({
  text: {
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
    type: Date, 
    default: () => new Date()
  }
});

const Thought = mongoose.model("Thought", ThoughtsSchema);

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Happy Thoughts API!");
});

app.post("/thoughts", async (res, req) => {
  const {text, createdAt} = req.body;
  try {
    const newThought = await new Thought({text: text, createdAt: createdAt}).save();
    res.status(201).json({success: true, response: newThought});
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
});

app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({createdAt: "dec"}).limit(20).exec();
    res.status(200).json({success: true, response: thoughts})
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
});

// //////// What Daniel did 
// const TechnigoMemberSchema = new mongoose.Schema({
//   name: {
//     // most important one
//     type: String,
//     // forces to provide this value
//     required: true,
//     // new name will have to be different than all others in the DB 
//     unique: true,
//     // all the allowed values 
//     enum:  ["Matilda", "Poya", "Petra", "Hanna", "Daniel"]
//   },
//   description: {
//     type: String, 
//     minlength: 4,
//     maxlength: 30,
//     // removes unnecessary whitespaces
//     trim: true
//   },
//   score: {
//     type: Number, 
//     // initial value, if none other is specified
//     default: 0
//   }, 
//   createdAt: {
//     type: Date,
//     // new Date() will execute once - when we start the server
//     // default: new Date()

//     // This function is not called right away. More controlled approach according to Daniel 
//     default: () => new Date()
//   }
// });

// const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema);

// // Listen 11:39 for which method to use front/back
// // version 1 - most universal one, the asyncronus ones. 
// app.post("/members", async (res, req) => {
//   const {name, description} = req.body;
//   try {
//     const newMember = await new TechnigoMember({name: name, description: description}).save();
//     // Devils in the details: 201 means created
//     res.status(201).json({success: true, response: newMember});
//   } catch (error) {
//     res.status(400).json({success: false, response: error});
//   }
// });

// // version 2 POST with 
// // app.post("/members", async (res, req) => {
// //   const {name, description} = req.body;
// //     const newMember = await new TechnigoMember({name: name, description: description}).save()
// //       .then(data => {
// //         res.status(201).json({success: true, response: data});
// //       }).catch(error => {
// //         res.status(400).json({success: false, response: error});
// //       })
// // });


// // other versions mostly för kännedom 
// // version 3  - POST mongoose syntax 
// // app.post("/members", async (res, req) => {
// //   const {name, description} = req.body;

// //     const newMember = await new TechnigoMember({name: name, description: description}).save((error, data) => {
// //       if (error) {
// //         res.status(400).json({success: false, response: error});
// //       } else {
// //         res.status(201).json({success: true, response: data});
// //       }
// //     });
// // });

// // POST => create stuff 
// // PUT => replace in DB -> one person switch with another
// // PATCH => change/modify stuff 

// // $inc is mongoose syntax
// // if using outside variable then you have to use `` 

// app.patch("/members/:id/score", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}});
//     res.status(200).json({success: true, response: `Member ${memberToUpdate.name} has their scoure updated`});
//   } catch (error) {
//     res.status(400).json({success: false, response: error});
//   }
// });

// //////// And below  thursday
// // Pagination - with alot of data this come in handy 

// // app.get("/members", async (req, res) => {
//   // V1 mongoose - framework for dealing with mongo 
//   // const {page, perPage} = req.query;
//   // try {
//   //   const members = await TechnigoMember.find({}).sort({createdAt: -1})
//   //   .skip((page - 1) * perPage).limit(perPage);
// // Items are sorted, so we are always skipping the same, pages do not differ based on variance
//   //  case 1 == page is 1, perPage is 10
//   //  .skip( 1 - 1) == 0; 0*10 == 0 => skip(0) => not skipping anything; 
//   // .limit(10) => we are returning 10 items, not skipping anything, first 10 items are returned; 
//   //  case 2 == page is 2, perPage is 10
//   //  .skip( 2 - 1) == 1; 1*10 == 10 => skip(10) => skipping 10 items == skipping the first page; 
//   // .limit(10) => we are returning 10 items, skipping the first page, second 10 items are returned; 
//   //  case 3 == page is 43, perPage is 10
//   //  .skip( 43 - 1) == 42; 42*10 == 420 => skip(420) => skipping 420 items == skipping the first 420 pages; 
//   // .limit(10) => we are returning 10 items, skipping the first 42 pages,  the 43rd 10 items are returned;

//   // res.status(200).json({success: true, response: members});

//   // } catch (error) {
//   //   res.status(40).json({success: false, response: error});
//   // }

// /// V. 2 Mongo (when not using mongoose) practise this a little. . . 
// // + makes page in to numbers! 
// // const { page, perPage, numberPage = +page, numberPerPage = +perPage} = req.query;
// // try {
// //   const members = await TechnigoMember.aggregate([
// //     {
// //       $sort: {
// //         createdAt: -1
// //       }
// //     }, 
// //     {
// //       $skip: (numberPage -1) * numberPerPage
// //     }, 
// //     {
// //       $limit: numberPerPage
// //     }
// //   ]);
// //   res.status(200).json({success: true, response: members});
// // } catch (error) {
// //   res.status(400).json({success: false, response: error});
// // }

// // });

// app.delete("/members/:id", async(req, res) => {
//   const { id } = req.params;
//   // Delete removes entry and returns the removed one 
//   // Remove removes entry and return true/false
//   try {
//     const deletedMember = await TechnigoMember.findOneAndDelete({_id: id});
//     if (deletedMember) {
//       res.status(200).json({success: true, response: deletedMember});
//     } else {
//       res.status(404).json({success: false, response: "Not found"});
//     }
//   } catch (error) {
//     res.status(400).json({success: false, response: error});
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
