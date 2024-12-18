import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import expressListEndpoints from "express-list-endpoints";

import { errorHandler } from "./middleware/errorHandler.js";
import { thoughtRoutes } from "./routers/thoughtRoutes.js";
import { likeRoutes } from "./routers/likeRoutes.js";

export const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/thoughts", thoughtRoutes);
app.use("/thoughts", likeRoutes);

// API documentation
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.send(endpoints);
});

// Error handling middleware    
app.use(errorHandler);