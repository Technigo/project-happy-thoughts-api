# Project Happy Thoughts API

This project aimed at creating my own api for a previous project called Happy thoughts to be replaced by the external api used before.

## FEATURES

The API has the following endpoints:

GET /thoughts - Returns all thoughts by find() function. and then it limit the amount of thoughts saved in the database to maximum of 20 thoughts and finally sorts the thoughts in a descending order.

POST /thoughts - Made it possible to post a new thought to the database by massing in a message in the body.

POST /thoughts/:thoughtId/like - Made it possible to "like" a thought by using findByIdAndUpdate() function to update the amount of likes increase by 1 each time.

DELETE /thoughts/:id - Made it possible to delete a thought by using findOneAndDelete() function.

PATCH /thoughts/:id - Made it possible to update a thought by using findOneAndUpdate().

(DELETE and PATCH are not currently used in the front end it is there for future adding on more functions to the project.)

All of the endpoints have error handling with a try and catch block.

## The process and obstacles

The learning objectives was to create a thought model and a schema. each of the properties should have special rules or validations that I had to implement to make it a good API to fit the frontend.
I built the thoughtschema with a message, hearts and createdAt according to the requirements. Then I created POST endpoints using mongoose queries with helper functions. I chose to go for the async await approach in my endpoints instead of promises because I wanted to get more familiar with the usage of that which I had less experience with compaared to promises.

## View it live

Backend: https://happy-thoughts-project-api.herokuapp.com

frontend: https://waliem-project-happy-thoughts.netlify.app/
