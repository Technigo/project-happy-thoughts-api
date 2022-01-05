# Project Happy Thoughts API

Earlier, for the Happy Thoughts project, I built a frontend in React which uses an API to store thoughts and updating likes. For this project, the assignment was to build my own API which works in the same way and should become a drop-in replacement for the API I used in the React frontend.

## The problem

For this new API, I started to build a 'Thought' Mongoose model which has properties for the 'message' string, a 'heart' property for tracking the number of likes, and a 'createdAt' property to store when the thought was added.

After that I needed to add 3 endpoints:

'GET /thoughts'
A Get request using async/await keywords, and methods for the endpoint to return a maximum of 20 thoughts, sorted by 'createdAt' to show the most recent thoughts first.

'POST /thoughts'
A Post request using async/await keywords, creating a new thought 'message', which is being stored in the database with the save() method.

'POST /thoughts/:thoughtId/like'
A Post request using async/await keywords, finding an ID and updates the heart property value by 1, using the findByIdAndUpdate() method.


## View it live

https://project-happy-thoughts-api-kim.herokuapp.com/
The API used in the frontend project: https://happy-thoughts-kim.netlify.app/

