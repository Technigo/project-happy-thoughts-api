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
        res.json(400).json({message: "Please try again", errors: err.errors})
    })
})

//Get thoughts by id

router.get('/:thoughtId', async (req, res) => {
  try {
      const thought = await Thought.findById(req.params.thoughtId)
      res.json(thought)
  } catch (err) {
      res.json({message: err})
  }
})

//https://happy-thoughts-technigo.herokuapp.com/thoughts/THOUGHT_ID/like

router.post('/:thoughtId/like', async (req, res) => {
    try {
      const likedThought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId},
        { $inc: { hearts: 1 } }
      )
      res.status(200).json(likedThought)
    } catch (err) {
      res.status(400).json({ message: 'Could not find thought', errors: err.errors })
    }
  })


//Update and delete

//   router.delete('/:thoughtId', async (req, res) => {
//     try {
//        const removedThought = await Thought.remove({_id: req.params.thoughtId})
//        res.json(removedThought)
//      } catch (err) {
//          res.json({message: err})
//      }
//  })
 
//  router.patch('/:thoughtId', async (req, res) => {
//      try {
//          const updatedThought = await Thought.updateOne(
//              {_id: req.params.thoughtId}, 
//              {$set: {message: req.body.message}}
//              )
//              res.json(updatedThought)
//      } catch (err) {
//          res.json({message: err})
//      }
//  })


module.exports = router