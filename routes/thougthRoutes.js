import express from "express";
import listEndpoints from "express-list-endpoints";
import { ThoughtModel } from "../models/Thought";

const router = express.Router(); // Function to create a new router object to handle requests

// This endpoint is for documentation of all the endpoints
router.get("/", async (req, res) => {
    try {
        const endpoints = listEndpoints(router);
        res.json(endpoints);
    } catch (err) {
        res.status(500).json({message: "Internal Server Error", error: err.errors});
    }
})

// This endpoint should return a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first - comment this out if implementing pagination otherwise pagination won't work
router.get("/thoughts", async (req, res) => {
    // Use the ThoughtModel to find all the thoughts in the database, return max 20 thoughts sorted by createdAt in descending order
    try {
        const thoughts = await ThoughtModel.find()
            .sort({createdAt: "desc"})
            .limit(20)
            .exec();
        res.json(thoughts);
    } catch (err) {
        res.status(400).json({message: "Cannot load thoughts", error: err.errors});
    }
})

// Implementing pagination when getting all the thoughts - user can insert the page number and limit the number of thoughts per page as queries
// router.get("/thoughts", async (req, res) => {
//     // Get the page and limit variables from url and turn them into numbers
//     const page = parseInt(req.query.page) || 1; //default to 1 if not provided
//     const limit = parseInt(req.query.limit) || 10; // default to 10 if not provided
    
//     // Handle invalid page and limit
//     if (isNaN(page) || isNaN(limit)) {
//         return res.status(400).json({ message: "Invalid page or limit value" });
//     } else {
//         // Handle page value less than 1
//         const skip = (page - 1) * limit;
//         const skipValue = skip < 0 ? 0 : skip;

//         try {
//             const selectedThoughts = await ThoughtModel.find()
//                 .limit(limit)
//                 .skip(skipValue) // "skip" method receives a number as a parameter and allows the user to specify the number of documents to skip
//                 .sort({createdAt: "desc"})
//                 .exec();

//             // Get the number of thoughts in the database
//             const countOfThoughts = await ThoughtModel.countDocuments();

//             // Check if there are thoughts in the database before implementing pagination
//             if (countOfThoughts === 0) {
//                 return res.status(404).json({ message: "No thoughts found" });
//             } else {
//                 res.status(200).json({
//                     selectedThoughts,
//                     pagination: {
//                         totalPages: Math.ceil(countOfThoughts/limit),
//                         currentPage: page,
//                         totalItems: countOfThoughts,
//                         itemsPerPage: limit
//                     }
//                 })
//             }
//         } catch (err) {
//             res.status(500).json({message: "Internal Server Error", error: err.errors});
//         }
//     }
// })

// This endpoint expects a JSON body with the thought message, like this: { "message": "Express is great!" }. If the input is valid (more on that below), the thought should be saved, and the response should include the saved thought object, including its _id.
router.post("/thoughts", async (req, res) => {
    // Retrieve the message sent by the user to our API endpoint
    const newMessage = req.body.message;

    // Use the Mongoose model to create the database entry
    const thought = new ThoughtModel({message: newMessage});

    try {
        // Success
        if (newMessage.length >= 4 & newMessage.length <= 140) {
            const savedThought = await thought.save();
            res.status(201).json(savedThought);
        } else {
            res.status(400).json("Your message must be between 4 and 140 characters long");
        }    
    } catch (err) {
        res.status(400).json({message: "Cannot save thought to the database", error: err.errors});
    }
})

// This endpoint works with both POST and PUT requests, but PUT request makes more sense to me as it is to update the hearts, not to create a new one. 
// This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its "hearts" property to add one heart.
router.put("/thoughts/:thoughtId/like", async (req, res) => {
    const { thoughtId } = req.params;

    try {
        // Use ThoughtModel to find the thought with the given ID, increment the number of hearts by 1 and return the updated document, otherwise findByIdAndUpdate will return the original document before any modifications.
        const likedThought = await ThoughtModel.findByIdAndUpdate(thoughtId, {$inc: {hearts: 1}}, {new: true});
        
        if (likedThought) {
            res.status(200).json(likedThought);
        } else {
            res.status(400).json({message: "Thought not found"});
        } 
    } catch (err) {
        res.status(400).json({message: "Cannot update the number of likes for this message", error: err.errors});
    }
})

export default router;