// Importing the required module
import mongoose from "mongoose";

// Destructuring 'Schema' from mongoose
const { Schema } = mongoose;

// Defining the schema for the thoughts
export const thoughtSchema = new Schema({
  // Properties for message string
  message: {
    type: String, // Specifies that 'message' should be a string
    required: true, // Indicates that 'message' is a required field
    minlength: 5, // Sets a minimum length of 5 characters for 'message'
    maxlength: 140, // Sets a maximum length of 140 characters for 'message'
  },
  hearts: {
    type: Number, // Specifies that 'hearts' should be a number
    default: 0, // Sets a default value of '0' for 'hearts'
  },
  createdAt: {
    type: Date, // Specifies that the createdAt field will store values in a Date format, allowing it to hold date and time information
    default: Date.now, // Sets the default value for createdAt to the current date and time when a new document is created
  },
});

// Creates a Mongoose model named 'ThoughtModel' based on the 'thoughtSchema' for the 'thoughts' collection
export const ThoughtModel = mongoose.model("thoughts", thoughtSchema);
