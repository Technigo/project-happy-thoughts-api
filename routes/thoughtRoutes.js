import express from "express"
import listEndpoints from "express-list-endpoints"
// import {ThoughtModel} from "..models/Thought"

const router = express.Router();

//---- Documentation of API ----
router.get("/", (req, res) => {
    try{
        const endpoints = listEndpoints(router);
        res.json(endpoints)
    }catch(error){
        res.status(500).json({error: "Internal server error"})
    }      
    
  });

  
  export default router
