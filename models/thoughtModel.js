// Import the mongoose library, which is a MongoDB object modeling tool for Node.js
const mongoose = require('mongoose');

// Define a mongoose schema for the 'goals' collection in MongoDB
const thoughtSchema = mongoose.Schema({
    // Define a 'message' field in the schema
    message: {
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 140
    }
}, {
    hearts: {
        type: Number,
        default: 0,
        immutable: true // Make the field read-only
    }
}, {
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true // Make the field read-only
    }
});

// Export the mongoose model based on the defined schema
module.exports = mongoose.model('Thought', thoughtSchema);