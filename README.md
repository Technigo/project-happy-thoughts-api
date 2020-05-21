# Project Happy Thoughts API

Project built within Technigo boot camp. Objective was to use new skills with Express and Mongodb to build an API which includes both GET request endpoints to return data and POST endpoints to create data. Also validate the data before posting, and handling errors.

## The problem

The challenge was to create an API and connect it to an existing frontend project, a "happy thoughts" message app where you also can like thoughts. The trickiest part was to update the number of likes for a thought. Techniques and tools used for the backend are MongoDB, Mongoose, Mongo Compass, Mongo Atlas, Express, Node, Heroku and more.


## View it live

Backend:
https://happy-thoughts-api-deployment.herokuapp.com/

Frontend:
https://happy-thoughts-lisah.netlify.app/


Example of endpoints:
// Get all thoughts
GET
https://happy-thoughts-api-deployment.herokuapp.com/thoughts

// Post a thought
POST
https://happy-thoughts-api-deployment.herokuapp.com/thoughts

// Like a thought
PUT
https://happy-thoughts-api-deployment.herokuapp.com/thoughts/5ec58ef49e04cc1351d91ee9/like
