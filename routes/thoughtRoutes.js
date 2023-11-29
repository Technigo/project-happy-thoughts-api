import express from "express"
import listEndpoints from "express-list-endpoints"
import {ThoughtModel} from "../models/Thought"

const router = express.Router();


// --------- Routes for GET request --------

// Documentation of API
router.get("/", (req, res) => {
    try{
        const endpoints = listEndpoints(router);
        res.json(endpoints)
    }catch(error){
        res.status(500).json({error: "Internal server error"})
    }    
    });

// Route for retrieving 20 latest posted happy thoughts based on createdAt date
router.get("/thoughts", async (req,res)=>{
    try {
        const thought = await ThoughtModel.find().sort({createdAt: "desc"}).limit(20).exec()
        //success
        res.json(thought)
    } catch(error) {
        //internal error
        res.status(500).json({error: `Internal server error: ${error.message}` })
        }       
   })    


//------- Routes for POST requests --------  

// Route for one happy thought post request
router.post("/thoughts", async (req,res)=>{
    try{
        const {message, hearts} =req.body    
        console.log(message)
        const thought = await ThoughtModel.create({message:message, hearts:hearts} )
        res.json(thought)
    } catch(error) {
        res.status(500).json({ message: `Posting message failed due to error: ${error.message}` })
    }
})

// Route for a heart/like increment on a single post by id
router.post("/thoughts/:id/like", async (req,res)=>{
    // First, finding the thought by its id
    const {thoughtId} = req.params
    try{
    const thought = await ThoughtModel.findById(req.params.id)
    //failed request
    if (!thought){
        return res.status(404).json({message:`Thought with id ${thoughtId} not found.`})
        // note: 
        // To get this error:
        // CastError: Cast to ObjectId failed for value "6567a0dd7241308b35330e" (type string) at path "_id" for model "happyThoughts".  
        // reason: BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer i.e. change id string but respect id length
    }
    // success
    // incrementing the hearts by 1
    thought.hearts += 1
    // saving the updated thought
    const updatedThought = await thought.save()
    res.json(updatedThought)
    } catch(err) {
        console.log(err)
     res.status(500).json({message: `Error in incrementing number of likes due to error: ${err.message}`})
    }
})

  export default router
