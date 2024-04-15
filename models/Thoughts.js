//Import the mongoose library, which is an ODM (Object Data Modeling) library for MongoDB
import mongoose from "mongoose";

// Destructure the Schema object from the mongoose library
const { Schema } = mongoose;

// Define a Mongoose schema for the "thought" document in MongoDB
export const thoughtSchema = new Schema({
  // Define the "message" field with specific properties
  message: {
    type: String, // Data type of the field is String
    required: true, // Field is required (must be present)
    minlength: 5, // Minimum length of the string is 5 characters
    maxlength: 140, // Maximum length of the string is 140 characters
    trim: true, // Remove leading and trailing whitespaces from the string
  },
  // Define the "hearts" field with specific properties
  hearts: {
    type: Number, // Data type of the field is Number
    default: 0, // Default value is 0 if not provided
  },
  // Define the "createdAt" field with specific properties
  createdAt: {
    type: Date, // Data type of the field is Date
    default: Date.now, // Default value is the current date and time
  },
});

// Create a Mongoose model named "Thought" based on the defined schema
export const ThoughtModel = mongoose.model("Thought", thoughtSchema);
