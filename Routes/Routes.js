import express from "express";
import Thought from "../models/Thought";



  // Route for the root
  const listEndpoints = require("express-list-endpoints");
// Create an instance of the Express router
// The router method in this code is like setting up a map or a blueprint for handling different kinds of requests in a web application. It helps organize and define how the application should respond when someone visits different URLs. Think of it as creating a list of instructions for the app to follow when it receives specific requests, like "show me all tasks" or "register a new user." This makes the code neat and helps the app know what to do when someone interacts with it.
const setUpRoutes = (app) => {
  const router = express.Router();

  // Start defining your routes here
 app.get("/", (req, res) => {
  res.send(listEndpoints(app));
   
 });

  // Modification: Now using the passed app object for listEndpoints
 /* app.get("/", (req, res) => {
     res.json(listEndpoints(router));
      //res.send("It works!")
  });*/

  /*app.get("/", async (req, res) => {
    try {
      const endpoints = listEndpoints(router);
      res.json(endpoints);
    } catch (error) {
      res.status(500).json({ error: "Internal  Error" });
    }
  });*/
  
  // Route for retrieving thoughts
app.get('/thoughts', async (req, res) => {
    try {
      const thoughts = await Thought.find().sort({ createdAt: -1 }).limit(20);
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(400).json({ message: 'Could not fetch thoughts', error: err.errors });
    }
  });

// POST endpoint for creating a new thought
app.post('/thoughts', async (req, res) => {
    try {
      const { message } = req.body;
      const newThought = new Thought({ message });
      const savedThought = await newThought.save();
      res.status(201).json(savedThought);
    } catch (err) {
      res.status(400).json({ message: 'Could not save thought', error: err.errors });
    }
  });

// POST endpoint for liking a thought
app.post('/thoughts/:thoughtId/like', async (req, res) => {
    try {
      const { thoughtId } = req.params;
      const thought = await Thought.findByIdAndUpdate(
        thoughtId,
        { $inc: { hearts: 1 } },
        { new: true }
      );
      if (!thought) {
        res.status(404).json({ message: 'Thought not found' });
      } else {
        res.status(200).json(thought);
      }
    } catch (err) {
      res.status(400).json({ message: 'Invalid request', error: err.errors });
    }
  });

  //export default Router;
  //app.use("/", router);
};

export default setUpRoutes;