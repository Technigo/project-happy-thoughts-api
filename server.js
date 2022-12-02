import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;



const ThoughtsSchema = mongoose.Schema ({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlenght: 140,
    trim: true
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
});

const Thought = mongoose.model("Thought", ThoughtsSchema)

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
  res.send("This is my API for Happy Thought-project. Find it live here:");
});

// Returning the thoughts
app.get("/thoughts", async (req, res) => {
  try {
    const thoughts = await Thought.find().sort({ createdAt: "desc" }).limit(20);
    res.json(thoughts)
  } catch(err) {
    res.status(400).json({
      message: "Could not find this post",
      response: err.errors,
      success: false,
    });
  }
});

// Posting thoughts

app.post("/thoughts", async (req, res) => {
  const { message } = req.body;
  try {
    const newThought = await new Thought({ message }).save();
    res.status(201).json({success: true, response: newThought})
  } catch(err) {
    res.status(400).json({
      message: "Could not post this thought",
      response: err.errors,
      success: false,
    });
  }
});

// Likeing thouhts
app.patch("/thoughts/:thoughtId/like", async (req, res) => {
  const { thoughtId } = req.params;
  try {
    const likedThought = await Thought.findByIdAndUpdate(thoughtId, {
      $inc: { hearts: 1},
    });
    res.status(200).json({success: true, response: `Likeing works! This post gos ${likedThought.hearts} likes!`});
  } catch (err) {
    res.status(400).json({
      message: "Could not find and update post",
      response: err.errors,
      success: false,
    });
  }
});


////////////////////////
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



// // ------------- CODE ALONG ------------- //
// ////////////////////////
// // const TechnigoMemberSchema = new mongoose.Schema({
// //   name: {
// //     // type: most important one
// //     type: String,
// //     // required: forces to provide this value
// //     required: true,
// //     // unique: new name will have to be different than all others in the DB
// //     unique: true,
// //     // enum: all the allowed values 
// //     enum: ["Charlotte", "Markus", "Sigrid"]
// //   },
// //   description: {
// //     type: String,
// //     minlength: 6,
// //     maxlength: 30,
// //     // trim: removes unnecessary whitespaces
// //     trim: true
// //   },
// //   score: {
// //     type: Number,
// //     // dafault: initial value, if none other is specified
// //     default: 0
// //   },
// //   createdAt: {
// //     type: Date,
// //     // new Date() will execute once - then we start the server
// //     // default: new Date()
// //     // x
// //     default: () => new Date()
// //   }
// // });

// const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema);

// // V1 most universal
// // app.post("/members", async (req, res) => {
// //   const {name, description} = req.body;
// //   console.log(req.body);
// //   try {
// //     const newMember = await new TechnigoMember({name: name, description: description}).save();
// //     res.status(201).json({success: true, response: newMember});
// //   } catch(error) {
// //     res.status(400).json({success: false, response: error});
// //   }
// // });

// // V2 POST with promises
// app.post("/members", (req, res) => {
//   const {name, description} = req.body;
//     const newMember = new TechnigoMember({name: name, description: description}).save()
//     .then(data => {
//         res.status(201).json({success: true, response: data});
//     }).catch(error => {
//       res.status(400).json({success: false, response: error});
//     });
// });

// // V3 POST mongoose syntax
// // app.post("/members", (req, res) => {
// //   const {name, description} = req.body;
// //     const newMember = new TechnigoMember({name: name, description: description}).save((error, data) => {
// //       if(error) {
// //         res.status(400).json({success: false, response: error});
// //       } else {
// //         res.status(201).json({success: true, response: data});
// //       }
// //     });
// // });

// // POST => create stuff
// // PUT => replace in DB -> one person switch woth another person
// // PATCH => change/modify stuff

// app.patch("/members/:id/score", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}});
//     res.status(200).json({success: true, response: `Member ${memberToUpdate.name} has their score updated`});
//   } catch (error) {
//     res.status(400).json({success: false, response: error});
//   }
// });

// /// Thursday lession ///

// // Pagination //
// app.get("/members", async (req, res) => {
//   // const members = await TechnigoMember.find({});
//     // V1 mongoose //
//   // const {page, perPage} = req.query;
//   // try {
//   //   const members = await TechnigoMember.find({}).sort({createdAt: -1})
//   //   .skip((page -1 ) * perPage).limit(perPage);
//   //   // case 1 == page is 1, perPage is 10
//   //   // .skip ( 1 -1) == 0; 0*10 == 0 => skip(0) => not skipping anything
//   //   // .limit(10) => we are returning 10 items, not skipping anything, first 10 items are returned
    
//   //   // case 2 == page is 1, perPage is 10
//   //   // .skip ( 2 -1) == 1; 1*10 == 10 => skip(10) => skipping 10 first item
//   //   // .limit(10) => we are returning 10 items, skipping the first page, second 10 items are returned
    
//   //   // case 3 == page is 43, perPage is 10
//   //   // .skip ( 43 -1) == 42; 42*10 == 420 => skip(420) => skipping 420 items == skipping the first 420 pages
//   //   // .limit(10) => we are returning 10 items, skipping the first 42 pages, the 43rd items are returned
//   //   res.status(200).json({success: true, response: members})
//   // } catch (error) {
//   //   res.status(400).json({success: false, response: error})
//   // }

//   // V2 Mongo
//   const { page, perPage, numberPage = +page, numberPerPage = +perPage } = req.query;
//   try {
//   const members = await TechnigoMember.aggregate([
//       {
//         $sort: {
//           createdAt: -1
//         }
//       },
//       {
//         $skip: (numberPage -1) * numberPerPage
//       },
//       {
//         $limit: numberPerPage
//       }
//   ]);
//     res.status(200).json({success: true, response: members})
//   }
//   catch (error) {
//     res.status(400).json({success: false, response: error})
//   }
// });

// // http://localhost:8080/members?page=2&perPage=1

// app.delete("/members/:id", async (req, res) => {
//   const { id } = req.params;
//   // Delete removes entry and returns the deleted one 
//   // Remove removes entry and returns true/false
//   try {
//     const deleteMemeber = await TechnigoMember.findOneAndDelete({_id: id});
//     if (deleteMemeber) {
//       res.status(200).json({success: true, response: deleteMemeber})
//     } else {
//       res.status(404).json({success: false, response: "Not found"})
//     }
//   } catch (error) {
//     res.status(400).json({success: false, response: error})
//   }
// });

// /// Nesting Schemas
// const TestSchema = new mongoose.Schema({
//   testProperty: {
//     type: String
//   },
//   secondTestProperty: {
//     type: Number,
//     default: 8
//   }, 
// });
// const SuperSchema = new mongoose.Schema({
//   superTestProperty: {
//     type: String
//   },
//   superSecondTestProperty: {
//     type: Number,
//     default: 8
//   },
//   lalalala:  {
//     type: TestSchema,
//     required: true
//   }
// });
// const SuperModel = mongoose.model("SuperModel", SuperSchema);
// const SuperObject = newSuperModel({
//   superTestProperty: "superTestProperty",
//   superSecondTestProperty: 9,
//   lalalala: {
//     testProperty: "testProperty",
//     secondTestProperty: 10
//   }

// })

