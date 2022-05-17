import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/thoughts";

const connectDB = () => {
  try {
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
};

export default connectDB;