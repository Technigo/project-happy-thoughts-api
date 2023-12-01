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
        const thought = await ThoughtModel.find()
        .sort({createdAt: "desc"})
        .limit(20)
        .exec()
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
        const {message} =req.body    
        console.log(message)
        const thought = await ThoughtModel.create({message:message} )
        res.json(thought)
    } catch(error) {
        res.status(400).json({ message: "Could not save message to database", error:error.errors})
    }
})

// Route for a heart/like increment on a single post by id
router.post("/thoughts/:thoughtId/like", async (req,res)=>{
    // First, finding the thought by its id
    const {thoughtId} = req.params
    try{
    const thought = await ThoughtModel.findById(thoughtId)
    //failed request
    if (!thought){
        return res.status(404).json({message:`Thought with id ${thoughtId} not found.`})
    }
    // success
    // incrementing the hearts by 1
    thought.hearts += 1
    // saving the updated thought
    const updatedThought = await thought.save()
    res.json(updatedThought)
    } catch(err) {
        console.log(err)
     res.status(500).json({ message: "Error in incrementing number of likes", error: err.errors})
    }
})

  export default router
