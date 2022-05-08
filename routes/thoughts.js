import express from "express"
import Thought from "../models/Thought"

const router = express.Router()

router.get('/', async (req, res) => {
    const thoughts = await Thought.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    res.json(thoughts)
 })


//I wanted to try out different syntax for promises (I could have used async and await here as well for consistency.)
router.post('/', (req, res) => {
    const thought = new Thought({
        message: req.body.message,
    })
    thought.save()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => {
        res.json(500).json({message: "There is an unknown issue for posting a thought. Please try again", errors: err.errors})
    })
})

//https://happy-thoughts-technigo.herokuapp.com/thoughts/THOUGHT_ID/like

router.post('/thoughts/:thoughtId/like', async (req, res) => {
    try {
      const likedThought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $inc: { hearts: 1 } },
        { new: true }
      )
      res.status(200).json(likedThought)
    } catch (err) {
      res.status(400).json({ message: 'Could not find thought', errors: err.errors })
    }
  })


//Update and delete

//   router.delete('/:postId', async (req, res) => {
//     try {
//        const removedPost = await Post.remove({_id: req.params.postId})
//        res.json(removedPost)
//      } catch (err) {
//          res.json({message: err})
//      }
//  })
 
//  router.patch('/:postId', async (req, res) => {
//      try {
//          const updatedPost = await Post.updateOne(
//              {_id: req.params.postId}, 
//              {$set: {title: req.body.title}}
//              )
//              res.json(updatedPost)
//      } catch (err) {
//          res.json({message: err})
//      }
//  })


module.exports = router