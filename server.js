// import packages
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';
import thoughtsRouter from './routes/thoughts';

//Load enviroment variables from env file
dotenv.config();

//Configure mengoose to allow flexible queries
mongoose.set('strictQuery', false);

//Mongo db connection is set up
const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//Define port, in this case 8080
const port = process.env.PORT || 8080;

//Create instance from express application
const app = express();

//Enable CORS and JSON body parsin 
app.use(cors());
app.use(express.json());

//Mount the thought router
app.use('/thoughts', thoughtsRouter);

// Define root endpoint to display all available endpoints
app.get('/', (req, res) => {
  try {
    // Gets a list of required endpoints
    const endpoints = listEndpoints(app);

    // Respond with the list of endpoints
    res.json({ endpoints });
  } catch (error) {
    // Handle the error appropriately for the root endpoint
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
