# Project Happy Thoughts API

In this project I have used Express and MongoDB to build a Restful API which has GET and POST endpoints.

## The problem

The API has these endpoints:

GET ('/thoughts') - display all messages

POST ('/thoughts') - to post a new message

POST ('/thoughts/:id/hearts') - to like a message

DELETE ('/thoughts/:id') - to delete a message

After I had created my API with a Mongoose model and deployed my database, I connected it to my React frontend project. I updated my frontend with a delete-button to match my delete route in backend.

TECHNIQUES: RESTful API, MongoDB, Express, Mongoose, React

## View it live

Deployed API: https://happythoughts-api-mongodb.herokuapp.com/

Deployed frontend: https://react-happy-thoughts.netlify.app/