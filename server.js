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

//Schema allows us to reuse code
//We can combine a schema for certain propertys that shall remain together with properties that shall vary
//enum will add the only acceptable names to be able to pass to the name property
//trim deletes whitespace from beginning and end of string - not in between
//new Date needs to have anonymus function in order not to execute when page loads
const TechnigoMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum:["Karin", "Petra", "Matilda", "Poya", "Daniel"]
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

//Mongoose model allows of to use the methods like findings
const TechnigoMember = mongoose.model("TechnigoMember", TechnigoMemberSchema);

//POST request with async await - version 1
app.post("/members", async (req, res) => {
  const { name, description } = req.body;
  console.log(req.body);
  try {
    const newMember =  await new TechnigoMember({name: name, description: description}).save();

    res.status(201).json({response: newMember, success: true})
  } catch(error) {

    res.status(400).json({response: error, success: false});
  }
});

//POST with promises - version 2
// app.post("/members", (req, res) => {
 
//   const { name, description } = req.body;
//   console.log(req.body);

//     new TechnigoMember({name: name, description: description}).save()
//      .then(data => {
//       res.status(201).json({response: data, success: true});
//      }).catch(error => {
//       res.status(400).json({response: error, success: false});
//      })
// });

app.post("/members/:id/score", async (req, res) => {
  const { id } = req.params;
  try {
    //score updated first after the find is made therfor not visible in response
    const memberToUpdate = await TechnigoMember.findByIdAndUpdate(id, {$inc: {score: 1}});
    res.status(200).json({response: `Member ${memberToUpdate.name} has been updated`, success: true});
  } catch (error) {
    res.status(400).json({response: error, success: false});
  }
});

app.get("/members", async (req, res) => {
  //Mongoose version
  const {page, perPage} = req.query;
  try {
  const members = await TechnigoMember.find({}).sort({createdAt: -1})
    .skip((page -1) * perPage).limit(perPage)
  res.status(200).json({success: true, response: members});
  } catch (error) {
    res.status(400).json({success: false, response: error});
  }
  
  //Mongo version
  // const { page, perPage, numPage = +page, numPerPage = +perPage } = req.query;
  // try {
  // const members = await TechnigoMember.aggregate([
  //   {
  //     $sort: {
  //       createdAt: -1
  //     }
  //   },
  //   {
  //     $skip: (numPage -1) * numPerPage
  //   },
  //   {
  //     $limit: numPerPage
  //   }
  // ]);
  // res.status(200).json({success: true, response: members});
  // } catch (error) {
  //   res.status(400).json({success: false, response: error});
  // }
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// app.delete("member/:id", async (req, res) => {
//   const deleted = TechnigoMember.deleteOne
// })
// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

