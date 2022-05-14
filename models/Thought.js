import mongoose from "mongoose"

const ThoughtSchema = mongoose.Schema({
    message: {
        type: String,
        require: true,
        minlength: 5,
        maxlength: 140,
    },
    hearts: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Thought', ThoughtSchema)