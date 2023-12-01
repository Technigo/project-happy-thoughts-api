import mongoose from "mongoose"

const { Schema } = mongoose

export const thoughtSchema = new Schema ({
message:{
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140,
    trim: true 
},
hearts:{
    type: Number,
    default: 0
},
createdAt:{
    type: Date,
    default: Date.now
}
})

// Create a mongoose model named "ThoughtModel" based on the "thoughtSchema" for the "happyThoughts" collection
export const ThoughtModel = mongoose.model("happyThoughts", thoughtSchema)