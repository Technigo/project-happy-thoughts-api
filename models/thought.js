import mongoose from "mongoose";

// Define the Mongoose model for thoughts
const thoughtSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 140,
        trim: true,
    },
    complete: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    hearts: {
        type: Number,
        default: 0,
    },
});

const Thought = mongoose.model('Thought', thoughtSchema);

export default Thought;
