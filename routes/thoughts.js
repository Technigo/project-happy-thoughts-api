import express from "express"
import Thought from "../models/Thought"

const router = express.Router()

router.get('/', async (req, res) => {
    const thoughts = await Thought.find()
    res.json(thoughts)
 })

router.post('/', (req, res) => {
    const thought = new Thought({
        message: req.body.message,
    })
    thought.save()
    .then(data => {
        res.status(200).json(data)
    })
    .catch(() => {
        res.json(500).json({message: "There is an unknown issue for posting a thought. Please try again"})
    })
})

//https://happy-thoughts-technigo.herokuapp.com/thoughts/THOUGHT_ID/like

// router.post('/:thoughtId/like', async (req, res) => {
//     const addLike =  await new Thought.findById(req.params.postId)({
//         heart: req.body.heart,
//     })
//     thought.save()
//     .then(data => {
//         res.status(200).json(data)
//     })
//     .catch(() => {
//         res.json(500).json({message: "There is an unknown issue for posting a thought. Please try again"})
//     })
// })

module.exports = router