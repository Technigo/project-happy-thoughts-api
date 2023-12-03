import mongoose, { Schema } from "mongoose";

export const ThoughtsSchema = new Schema({
    message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 140,
    },
    hearts: {
        type: Number,
        default: 0, // This ensures that hearts can't be assigned when posting a new thought
    },
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
});

export const Thought = mongoose.model("Thought", ThoughtsSchema);