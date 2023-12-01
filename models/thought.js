// Imports the mongoose library for MongoDB interactions
const mongoose = require('mongoose')

// Define the schema for the 'Thought' model
const thoughtSchema = new mongoose.Schema({
    // Define the 'message' field in the schema
    message: {
        type: String,
        // The message is required, and an error message is provided if not present
        required: [true, 'Please write a happy thought'],
        // Mininmum length of the message, with an error message if not met
        minlength: [5, 'The message must be at least 5 characters long'],
        // Maximum length of the message, with an error message if exceeded
        maxlength: [140, 'Oups, too long, the message cannot be more than 140 characters']
    },
    // Define the 'hearts' field in the schema
    hearts: {
        type: Number,
        // Default value for hearts is set to 0
        default: 0,
    },
    // Define the 'createdAt' field in the schema
    createdAt: {
        type: Date,
        // Default value for createdAt is set to the current date and time
        default: Date.now,
        // Prevents createdAt from being modified after creation
        immutable: true
    }
});

// Create a model named 'thought' based on the defined schema
module.exports = mongoose.model('thought', thoughtSchema)