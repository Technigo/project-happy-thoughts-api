# Project Happy Thoughts API

The project is about building an Express app that can serve as a backend to an already existing frontend app - Happy Thoughts, kind of a twitter. The backend can provide the frontend with a list of thoughts (GET), create a new thoght (POST), add a heart to a thought (POST), and delete a thought (DELETE). 

I started by setting up a Mongodb locally and set up a mongoose schema for the data. The message property has some validations - required, min- and max length.

Once i saw it starting to work as expected i deployed the database to Atlas, which was surprisingly simple this time around. 

In case something goes horribly wrong with a request, I've implemented error handling with relevant status codes and messages. 

I used the dotend package to be able to use an environmental variable that lets me acces my remote database both in development and production, without exposing my login credentials in the code. 

## Endpoints

### (GET) /
A list of the endpoints rendered by the express-list-endpoints package

### (GET) /thoughts
Returns the 20 most recent thoughts

### (POST) /thoughts
Creates a new thought 

### (DELETE) /thoughts/delete/:id
Deletes thought by id

### (POST) /thoughts/:id/like
Increments hearts value by id

## Backend:
https://lars-happy-thoughts-backend.herokuapp.com/thoughts

## Frontend:
https://dreamy-noether-ab8986.netlify.app

