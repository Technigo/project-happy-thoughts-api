import mongoose from "mongoose";

const { Schema } = mongoose;

export const thoughtsSchema = new Schema({
    message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 140
    },
    hearts: {
        type: Number,
        default: 0,
       
    
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        
    }


},
{
    timestamps: true

});

export const ThoughtsModel = mongoose.model("thought" , thoughtsSchema)