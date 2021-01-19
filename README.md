# Project Happy Thoughts API

This project was about creating a happy thoughts API with MongoDB and use this API to fetch thoughts in a previous happy thoughts frontend project. 

## The problem

I started with creating a thought model and added the properties and then the validations to different properties. Then I added the routes for GET requests. After that I added the a route for the POST request in order to be able to post thoughts and populate the database. Mongoose was used in the project and validators in Mongoose. Try and catch was used to handle errors. If I had more time I would have added custom errors and a route to be able to delete thoughts.

## Endpoints

• Root - /

• GET /thoughts - Displays the latest 20 thoughts sorted by when the thought was created.

• POST /thoughts  - Post a happy thought using this endpoint.

• POST /thoughts/:thoughtId/like - Like a specific post by using the post's id in this endpoint. No JSON body required to post likes.


## View it live

https://happy-thoughts-api-project.herokuapp.com/
https://happythoughtsjessica.netlify.app/

