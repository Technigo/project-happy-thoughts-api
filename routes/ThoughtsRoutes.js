import mongoose from "mongoose";
import { ThoughtsModel } from "../models/Thoughts";
import { dotenv } from "dotenv";

dotenv.config()
const router = express.Router()


router.get("/get/thoughts" , async(req , res) => {
    await ThoughtsModel.find().slice(1,21)
    .then((result) => res.json(result))
    .catch((error) => res.json(error))
});

router.post("/post/thoughts" , async(req , res) => {
    const book = req.body;

    await ThoughtsModel.create({message: "Express is great!"})
    .then((result) => res.json(result))
    .catch((error) => res.json(error))

})
router.put("/update/thoughts/:thoughtId/like" , async(req , res)=>{
    const { id } = req.params;
    await ThoughtsModel.findByIdAndUpdate({_id: id})
    .then((result) => res.json(result))
    .catch((error) => res.json(error))


})
router.delete("/delete/:id" , async(req , res)=>{
    const { id } = req.params;
    await BookModel.findByIdAndUpdate(id)
    .then((result) =>{
        if(result){
            res.json({
                message: "book deleted successfully",
                deletedBook: result
            })
            
        }else{
            res.status(404).json({message: "book not found"})
        }

    })
    .catch((err) => res.status(500).json(err))
    
})
router.delete("/deleteAll" , async(req , res)=>{

    await BookModel.deleteMany({})
    .then((result) =>{
        if(result){
            res.json({
                message: "all books deleted",
                deletedCount: result.deletedCount
            })
            
        }else{
            res.status(404).json({message: "book not found"})
        }

    })
    .catch((err) => res.status(500).json(err))
    
    
})
export default router


