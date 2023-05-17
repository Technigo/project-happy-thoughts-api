import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

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
  res.send(listEndpoints(app));
});

/// Tuesday

const { Schema } = mongoose
const FruitOrVegetableSchema = new Schema({
  name: {
    // type is the most important one
    type: String,
    // required will be true or false, strongly recommended to use
    required: true,
    // make sure we have no duplicates in our database, only a new name that is different than all the others (that are already in the database) is allowed
    unique: true
  },
  description: {
    type: String,
    minlength: 4,
    maxlength: 40,
    // removes unnecessary white spaces from string
    trim: true
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  kind: {
    type: String,
    // an array of all the allowed values
    enum: ["fruit", "vegetable"]
  }
})

const FruitOrVegetable = mongoose.model("FruitOrVegetable", FruitOrVegetableSchema)

// POST
app.post("/fruit_or_vegetable", async (req, res) => {
  const { name, description, kind } = req.body
  try {
    //  const foodItem = await new FruitOrVegetable({ name: name, description: description, kind: kind })
    const foodItem = await new FruitOrVegetable({ name, description, kind }).save()
    // status code 201 is "created"
    res.status(201).json({
      success: true,
      response: foodItem,
      message: "created successfully"
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "error occurred"
    })
  }
})



// promises method - another way to do it that you will encounter in older code, legacy??
// app.post("/fruit_or_vegetable", (req, res)=>{
//   const {kind, name, description} = req.body;
//   const foodItem = new FruitOrVegetable({kind: kind, name: name, description: description}).save()
//     .then(item => {
//       res.status(201).json({
//         success: true,
//          response: item,
//          message: "created successfully"
//        });
//     }).catch(e => {
//       res.status(400).json({
//         success: false,
//         response: e,
//         message: "error occurred"
//       });
//     })
// });

// POST - create something
// PATCH - update
// PUT - replace


app.get("/fruit_or_vegetable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const foodItem = await FruitOrVegetable.findById(id);
    res.status(200).json({
      success: true,
      response: foodItem,
      message: "found successfully"
     });
  } catch(err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "did not find object with that id"
     });
  }
});

// PATCH
app.patch("/fruit_or_vegetable/:id", async (req, res) => {
  const { id } = req.params
  // const newDescription = req.body.newDescription
  const { newDescription } = req.body
  try {
    const foodItem = await FruitOrVegetable.findByIdAndUpdate(id, {description: newDescription})
    res.status(200).json({
      success: true,
      response: {},
      message: "update successful"
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      response: err,
      message: "error, update failed"
    })
  }
})

// DELETE
// https://stackoverflow.com/questions/54081114/what-is-the-difference-between-findbyidandremove-and-findbyidanddelete-in-mongoo
app.delete("/fruit_or_vegetable/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // const foodItem = await FruitOrVegetable.findByIdAndDelete(id);
    const foodItem = await FruitOrVegetable.findByIdAndRemove(id);

    res.status(200).json({
      success: true,
      response: foodItem,
      message: "deleted successfully"
     });
  } catch(e) {
    res.status(400).json({
      success: false,
      response: e,
      message: "did not successfully"
     });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
