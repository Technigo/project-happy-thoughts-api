import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import thoughtsRouter from "./routes/ThoughtsRoutes";

// Load environment variables
dotenv.config();

// Initialize express application
const app = express();
const port = process.env.PORT || 9090;

// Set mongoose options
mongoose.set("strictQuery", false);

// Middleware
app.use(express.json());

// Routes
app.use("/api", thoughtsRouter);

// Importing listEndpoints using CommonJS syntax
const listEndpoints = require("express-list-endpoints");

// Test to see if it logs correctly
console.log(listEndpoints); // Should now log the function

// Root endpoint to list all endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app); // Pass the app instance
  res.json({ endpoints });
});

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URI;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

/*import express from "express";
import { listEndpoints } from "express-list-endpoints";
import dotenv from "dotenv";
import mongoose from "mongoose";
import thoughtsRouter from "./routes/ThoughtsRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 9090;

// Middleware
app.use(express.json());

// Routes
app.use("/api", thoughtsRouter);

const listEndpoints = require("express-list-endpoints");

console.log(listEndpoints); // This should log the function, not undefined or {}

// Root endpoint to list all endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app); // Pass the app instance
  res.json({ endpoints });
});

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URI;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

import express from "express";
import { listEndpoints } from "express-list-endpoints"; // Import listEndpoints
import dotenv from "dotenv";
import mongoose from "mongoose";
import thoughtsRouter from "./routes/ThoughtsRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 9090;

// Middleware
app.use(express.json());

// Routes
app.use("/api", thoughtsRouter);

// Root endpoint to list all endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app); // Retrieve all endpoints
  res.json({ endpoints });
});

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URI;
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 9090;

// Set mongoose options
mongoose.set("strictQuery", false);

// MongoDB connection
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Happy Thoughts API!", endpoints });
});

// Define routes and start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Happy Thoughts API!", endpoints });
});

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import ThoughtsRoutes from "./routes/ThoughtsRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 9090;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");

    // Routes
    app.use("/api", ThoughtsRoutes);

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit the application if MongoDB connection fails
  });

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints"; // Import express-list-endpoints
import ThoughtsRoutes from "./routes/ThoughtsRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 9090;
const mongoUrl = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Start the server after successful MongoDB connection
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      listEndpoints(); // Call function to list endpoints once server is running
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process on connection error
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(ThoughtsRoutes);

// Function to list all endpoints in the Express application
const listEndpoints = () => {
  const endpoints = expressListEndpoints(app);
  console.log("List of Endpoints:");
  console.log(endpoints);
};

// Route to list all endpoints (optional)
app.get("/", (req, res) => {
  listEndpoints(); // Call function to list endpoints when accessing the root endpoint
  res.json({ message: "Welcome to the Happy Thoughts API!" });
});

// Export the Express app (optional)
export default app;
*/
