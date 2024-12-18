import mongoose from "mongoose";

export const connectToMongoDB = async() => {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/mongoAPI";

    try {
        await mongoose.connect(mongoUrl);
        mongoose.Promise = Promise;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Connection error", error.message);
        process.exit(1);
    }
}