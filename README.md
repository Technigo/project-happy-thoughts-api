# Project Happy Thoughts API

This project involved creating a Happy-Thoughts API which includes GET requests to return data and POST endpoints to create data. This connected to a previously built front-end to return a Full-Stack project.

## The problem

The first step was to create a model for the Thought message, allowing a user to Post a Thought-message to my deployed database by using the appropriate endpoint. The user can also access all messages by sending a GET request to the same endpoint. I also added a name property to the Thought model (and altered the frontend correspondingly) to allow the user to add their name.
Using the findByIdAndUpdate mongoose method, I built an endpoint to allow the user to like a specific message.

A Summary of endpoints:

/thoughts - GET and POST requests for sending and receiving data.
/thoughts/:thoughtId/like - POST request to allow the user to like a message
/thoughts/:thoughtId - PATCH and DELETE to update or delete a particular message


## View it live

Frontend:
https://kara-happy-thoughts.netlify.app/


Backend:
https://kara-happy-thoughts-api.herokuapp.com/