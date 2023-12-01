// Import the mongoose library, which is a MongoDB object modeling tool for Node.js
const mongoose = require('mongoose');

// Define a mongoose schema for the 'thoughts' collection in MongoDB
const thoughtSchema = mongoose.Schema({
    // The main content of the thought
    message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 140,
    },

    // The number of hearts (likes) received
    hearts: {
        type: Number,
        default: 0,
    },

    // The timestamp when the thought was created
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true, // Make the field read-only
    },
});

// Export the mongoose model based on the defined schema
module.exports = mongoose.model('Thought', thoughtSchema);
