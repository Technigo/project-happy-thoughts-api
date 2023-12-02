import express from "express";
import { ThoughtsModel } from "../models/Thoughts";

const router = express.Router()


router.get("/thoughts" , async(req , res) => {
    await ThoughtsModel.find({}).skip(0).limit(20).sort({ createdAt: 'desc'})
    .then((result) => res.json(result))
    .catch((error) => res.json(error))
});

router.post("/thoughts" , async(req , res) => {
    const thought = req.body;

    if(!thought.message){
        res.status(400).json({message: "empty thought is not allowed"})
        return
    }
    if(!thought.message.length < 5){
        res.status(400).json({message: "short thought is not allowed"})
        return
    }

    await ThoughtsModel.create({message: thought.message})
    .then((result) => res.json(result))
    .catch((error) => res.json(error))

})
router.put("/thoughts/:thoughtId/like" , async(req , res)=>{
    const { thoughtId } = req.params;
    console.log(req.params)
    await ThoughtsModel.updateOne({ _id: thoughtId }, { $inc: { hearts: 1 } })
    .then((result) =>  {
        if(result.matchedCount < 1){
            res.status(400).json({message: "thought not found"})
            return
        }
        res.json(result)
    })
    .catch((error) => res.json(error))


})
// router.delete("/delete/:id" , async(req , res)=>{
//     const { id } = req.params;
//     await BookModel.findByIdAndUpdate(id)
//     .then((result) =>{
//         if(result){
//             res.json({
//                 message: "book deleted successfully",
//                 deletedBook: result
//             })
            
//         }else{
//             res.status(404).json({message: "book not found"})
//         }

//     })
//     .catch((err) => res.status(500).json(err))
    
// })
// router.delete("/deleteAll" , async(req , res)=>{

//     await BookModel.deleteMany({})
//     .then((result) =>{
//         if(result){
//             res.json({
//                 message: "all books deleted",
//                 deletedCount: result.deletedCount
//             })
            
//         }else{
//             res.status(404).json({message: "book not found"})
//         }

//     })
//     .catch((err) => res.status(500).json(err))
    
    
// })
export default router


