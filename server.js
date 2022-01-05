import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/HappyApi";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
mongoose.Promise = Promise;

//mongo is a framework for Mongoose

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


const thoughtSchema = new mongoose.Schema({//call the function the same as the model (it's a method)
	//here we specify the types
  message: {
    type: String,
    required: [true, "Message is required!"],
    minlength: 5,
    maxlength: 140,
 
  },
  hearts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const HappyThought = mongoose.model('HappyThought', thoughtSchema);


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Welcome to the Happy Thoughts API')
})


//GET: This endpoint should return a maximum of 20 messages, sorted by createdAt to show the most recent messages first. */
app.get("/thoughts", async (req, res) => {
  const message = await HappyThought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();

  try {
    res.json(message);
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
});


// v1 - async await
app.post('/thoughts', async (req, res) => {
	const { message } = req.body;

	try {
    //sucessfull request
		const newHappyThought = await new Member({ message }).save();
		res.status(201).json({ response: newHappyThought, success: true });
	} catch (error) {
    //No good request
		res.status(400).json({ response: error, success: false });
	}
});


//endpoint to increase likes
app.post('/thoughts/:thoughtId/like', async (req, res) => {
  const { thoughtId } = req.params;

  try {
    const likeUpdate = await HappyThought.findByIdAndUpdate(
      {
        _id: thoughtId
      },
      {
        $inc: {
          hearts: 1
        }
      },
      {
        new: true
      }
    );

if (!updatedLike) {
      res.status(404).json({ response: 'No thought found with this specific ID', success: false })
    } else {
      res.status(200).json({ response: updatedLike, success: true });
    }
  } catch (error) {
    res.status(400).json({ response: error, success: false });
  }
})

// Start the server
app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server running on http://localhost:${port}`);
});
