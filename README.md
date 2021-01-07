# Project Happy Thoughts API

This project was about building a Happy thoughts API and connecting that to a frontend (a previous project). The frontend is a Twitter like page with the possibility to post happy thoughts and liking them by clicking on a heart.

## The problem

I started by setting up the mongoose.model and then doing the endpoints. There is one endpoint for all the thoughts (GET). Another endpoint is to post a thought (POST). One endpoint is for the likes to update (POST). I have also made error messages if there is a bad request.

I have deployed the API to Heroku and my database is deployed to MongoDB Atlas.

I have used these techniques for this project:
- MongoDB
- Mongoose
- Node.js
- Express

## View it live

My project deplyed to Heroku: 

https://happy-thoughts-ingela.herokuapp.com/

Endpoints:

https://happy-thoughts-ingela.herokuapp.com/thoughts 
Here you  will get a list of the 20 most recent thoughts. If you do a POST to this endpoint you will need a JSON body with the thought "message", like this: `{ "message": "I am feeling great!" }`. If the input is valid, which means 5-140 characters, the thought should be saved, and the response should include the saved thought object, including its `_id`.

https://happy-thoughts-ingela.herokuapp.com/thoughts/:thoughtId/like
This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its hearts property to add one heart.

Here you can find the frontend part of this project and try it out: https://ingelas-happy-thoughts.netlify.app/ (and here is my git hub repo for that project: https://github.com/IngelaL/project-happy-thoughts)

