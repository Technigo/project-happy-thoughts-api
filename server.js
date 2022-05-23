import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/happy-thoughts-api";
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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable" })
  }
})


const HappyThoughtsSchema = new mongoose.Schema({

  message: {
    type: String,
    minlength: 5,
    maxlength: 140,
    required: true,
    // Deletes whitespace from beginning and end of a string (but no spaces between words)
    trim: true
  }, 

  hearts: {
    type: Number,
    default: 0,
  },
  
  createdAt: {
    type: String,                                    
    // Anonymous function for the function to run for every new POST and not only when the application starts
    default: () => new Date(Date.now()).toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",})
  }
})

const HappyThoughts = mongoose.model('HappyThoughts', HappyThoughtsSchema)


// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get('/thoughts', async (req,res) => {
  // const {page, perPage} = req.query

  try {
    const allThoughts = await HappyThoughts.find({}).sort({createdAt: 'desc'}).limit(20) 
    // .skip((page -1 ) * perPage).limit(perPage)    
    res.status(200).json(allThoughts)
  }catch (error) {
    res.status(400).json({response: error, success: false})
  }
  
})

app.delete('/thoughts/:id', async (req, res) => {
  const { id } = req.params
  
  try {
    const deleted = await HappyThoughts.findOneAndDelete({_id: id})
    if(deleted) {
      res.status(200).json({response: deleted, success: true})
    } else {
      res.status(404).json({response: 'Not found', success: false})
    }
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})

app.patch('/thoughts/:id', async (req,res) => {
  const { id } = req.params
  const{ updatedMessage } = req.body

  try {
    const messageToUpdate = await HappyThoughts.findByIdAndUpdate({_id: id}, {message: updatedMessage})
    if(messageToUpdate) {
      res.status(200).json({response: messageToUpdate, success: true})
    } else {
      res.status(404).json({response: 'Not found', success: false}) 
    } 
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }

})


app.post('/thoughts', async (req, res) => {
  const { message } = req.body
  
  try {
    const newMessage = await new HappyThoughts({message: message}).save()
    // status 201 = created
    res.status(201).json({response: newMessage, success: true})
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})

app.post('/thoughts/:id/like', async (req, res) => {
  const { id } = req.params
  try {
    const heartToUpdate = await HappyThoughts.findByIdAndUpdate(id, {$inc: {hearts: 1}})
    res.status(200).json({response: 'You have liked this message', success: true})
  } catch (error) {
    res.status(400).json({response: error, success: false})
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
