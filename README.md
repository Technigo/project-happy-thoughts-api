# Project Happy Thoughts API

Makes use of new skills in Express and Mongodb to build an API which includes both GET request endpoints to return data and POST endpoints to create data.

## The problem

In order to replace the API we built, you're going to need to build a Thought Mongoose model which has properties for the message string, a heart property for tracking the number of likes, and a createdAt property to store when the thought was added.

Then, you'll need to add 3 endpoints:

In summary I got stuck on two things, MongoDB Atlas, was a new cluster needed or not? And I posted the first data to Mongo with test string instead of project name. Had to drop it but after that it worked fine.

The other issue was that I wrote the post request in slighty different way than provided guidance and got a bit stuck, first with naming and then with a missing curly {} :)


## View it live

https://th-project-happy-thoughts-api.herokuapp.com


### Basic documentation
- path":"/"
    "methods":["GET"]
    * List enpoints in api

- path":"/thoughts",
    "methods":["GET","POST"]
    * Get all thoughts or add a new thought with post request

- path":"/thoughts/:thoughtId/like"
    "methods":["POST"]
    * Add a heart to a thought with specific id
