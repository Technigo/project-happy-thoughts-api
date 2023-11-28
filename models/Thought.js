import mongoose from "mongoose";

const { Schema } = mongoose

export const thoughtSchema = new Schema({
    message: {
        type: String,
        required: true,
        minlenght: 5,
        maxlenght: 140,
        trim: true
    },

    hearts: {
        type: Number,
        default: 0,

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const ThoughtModel = mongoose.model("Happy Thoughts", thoughtSchema)