import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-happy-thoughts";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Thoughts = mongoose.model('Thoughts',{
  text:{
    type:String,
    required:true,
    minlength:5,
    maxlength:140
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  heart:{
    type:Number,
    default:0
  }
})
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

app.get('/thoughts', async(req, res)=>{
    const limit = parseInt(req.query.limit) || 20 // default limit is 10
  const page = parseInt(req.query.page) || 1 // default page is 1
  const skip = (page - 1) * limit // calculate the number of objects to skip
  const totalLengthofData=await Thoughts.find().countDocuments()
try{
  const thoughts = await Thoughts.aggregate([
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit }
  ])
  if(thoughts){
 res.status(200).json({
      success: true,
      message: "OK",
      body: {
        result: thoughts,
        totalPages: Math.ceil(totalLengthofData / limit)
      }
    })
  } else{
    res.status(404).json({ error: 'No thoughts found' })
  }}
  catch(err){
    res.status(400).json({ message:"Request failed", error: err })
  }
})

app.post('/thoughts', async(req, res)=>{
  const { text }= req.body
  const thought = await Thoughts({ text })

try{
  const savedThought = await thought.save()
res.status(200).json(savedThought);
}

catch(err){
res.status(400).json({message: 'Post failed', error:err })
}
})

app.post('/thoughts/:thoughtId/like', async(req, res)=>{
const {thoughtId} = req.params

try{
const thought = await Thoughts.findByIdAndUpdate(thoughtId, { $inc: { heart: 1 } }, { new: true });
if (thought) {
res.status(200).json(thought);
}
else {
      res.status(404).json({ message: 'Thought not found' });
    }
}
catch(err){
res.status(400).json({message: 'Failed to like thought', error:err })
}
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
