import mongoose from "mongoose";

const CONNECTION_URL = process.env.MONGO_URL || "mongodb://localhost/thoughts";

const connectDB = () => {
  try {
    mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
};

export default connectDB;