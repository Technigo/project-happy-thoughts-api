import mongoose from "mongoose";

const ThoughtSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 140,
    },
    name: {
        type: String,
        default: "Anonymous",
        minlength: 2,
        maxlength: 20,
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


const Thought = mongoose.model("Thought", ThoughtSchema);

export default Thought;