import mongoose from "mongoose"

const { Schema } = mongoose

export const thoughtSchema = new Schema({
    message: {
        type: String, 
        required: true, 
        minlength: 5, 
        maxlength: 140
    }, 
    hearts: {
        type: Number, 
        default: 0, 
        //Should not be assignable when creating a new thought
    }, 
    createdAt: {
         type: Date, 
         default: Date.now
        //Should not be assignable when creating a new thought
    }
})

export const ThoughtModel = mongoose.model("Thought", thoughtSchema)