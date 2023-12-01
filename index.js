import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/Routes";

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data to a json

// Middleware to check database connectivity before handling requests
// app.use((_, res, next) => {
//   if (mongoose.connection.readyState === 1) {
//     next();
//   } else {
//     // Returns a 503 Service Unavailable error to the client,
//     // indicating that the service cannot handle the request due to a lack of database connectivity.
//     res.status("503").json({
//       error: "Service unavailable"
//     });
//   }
// });

app.use(routes);

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
