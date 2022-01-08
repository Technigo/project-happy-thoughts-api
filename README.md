# Project Happy Thoughts API

An API built with Express and Mongodb that includes a GET request endpoint to return data, POST endpoints to create and delete data and a PATCH request endpoint to modify data.

## The problem

I created a Mongoose model that has properties for the message string, a heart property for tracking the number of likes, and a createdAt property to store when the thought was added. Each of the properties has some special validations in order to make a good API for the frontend. I added the following endpoints:

 GET /thoughts: To list the 20 most recent thoughts
 POST /thoughts: To post a new thought to the API
 POST /thought/:thoughtId/like: To like a thought with that id
 POST /thought/:thoughtId: To delete thought based on id
 PATCH /thought/:thoughtId: To modify thought based on id


## View it live

Link to API: https://happy-thoughts-api-rephili.herokuapp.com/
