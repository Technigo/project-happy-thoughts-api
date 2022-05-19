import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import getEndpoints from "express-list-endpoints"

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

const HappyThoughtSchema= new mongoose.Schema({
thought: {

type: String,
required:true,
minlength:5,
maxlength:140,
trim: true
},
likes:{
 type: Number,
 default: 0
},
createdAt:{ 
  type: Date,
  default:()=>new Date()
}
})

const HappyThought= mongoose.model("HappyThought", HappyThoughtSchema);

app.post("/thoughts", async (req,res)=>{
  const {thought} =req.body;
 
  try { 
    const newThought= await new HappyThought({thought:thought}).save()
    res.status(201).json({response: newThought, success:true})
 }
  catch(error){
    res.status(400).json({response: error, success:false})
 }
  })

app.post("/thoughts/:id/likes", async (req,res)=>{
  const{id}=req.params;
  try{
    const thoughtToUpdate= await HappyThought.findByIdAndUpdate(id,{$inc:{likes:1}})
    res.status(200).json({response: `Thought ${thoughtToUpdate.thought} has been updated`, succes:true})
  }catch(error){
    res.status(400).json({response: error, succes:false})
  }
})


app.get("/thoughts", async (req,res)=>{
 
  try{
   const thoughts= await HappyThought.find({}).sort({createdAt:-1}).limit(20).exec() //Vet ej om detta stämmer?
  
  res.status(200).json({success:true, response:thoughts})
 } catch(error){res.status(400).json({success:false, response:error})}

})

app.get("/", (req, res) => {
  res.send(getEndpoints(app));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
