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
https://www.postman.com/workspace/My-Workspace~7855bb11-d316-4606-804b-511882638d76/collection/39178525-61fa37bf-042d-4730-bd63-69b53e7554d0
// Error handling middleware    
app.use(errorHandler);