import { connectToMongoDB } from "./config/mongoDB.js";
import { app } from "./app.js"
import dotenv from "dotenv";


dotenv.config();

const port = process.env.PORT || 8080;

(async () => {
  try {
    // Connet to mongoDB
    await connectToMongoDB();

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.log("Failed to start server:", error.message);
    process.exit(1); // Exit the process on failure
  }
})();

// Simplify server.js to handle only the server initialization and database connection