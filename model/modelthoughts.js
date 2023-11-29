import moongose from 'mongoose';

const { Schema } = moongose;

export const ThoughtsSchema = new Schema( {
    /*Each of these properties has some special rules or validations 
    which must be implemented to make a good API for the frontend to use.*/
    //`message` - the text of the thought. Required. Min length 5, max length 140.
    message: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 140
    },
    //`hearts` - the number of heart clicks this thought has received from other users. Required. Default value 0.
    //users can't set when initially creating a thought, to prevent abuse or manipulation of heart counts.
    hearts: {
        type: Number,
        default: 0
    },
    //`createdAt` - the time the Thought was added to the database. Required. Default value the time of creation.
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const ModelThoughts = moongose.model('Thought', ThoughtsSchema);