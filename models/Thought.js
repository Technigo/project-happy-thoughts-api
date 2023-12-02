import mongoose from "mongoose";

// Creating a schema for the thought object
const thoughtSchema = new mongoose.Schema({
    // Message field for the thought with constraints
    message: {
        type: String,
        required: true,      // Message is required
        minlength: 5,        // Minimum length of 5 characters
        maxlength: 140       // Maximum length of 140 characters
    },
    // Hearts field to count likes for the thought
    hearts: {
        type: Number,
        default: 0           // Default value set to 0
    },
    // createdAt field to store the timestamp of when the thought was created
    createdAt: {
        type: Date,
        default: Date.now    // Default value set to the current date/time
    }
});

// Creating a Thought model based on the thoughtSchema
const Thought = mongoose.model("Thought", thoughtSchema);

export default Thought;
