# Project Happy Thoughts API
This is a project built during week 19 in the Technigo Bootcamp. 
The project was to build an API which includes both GET request endpoints to return data and POST endpoints to create data and use this to replace an API from the week 11 project with our newly built one. I built the API using Express and MongoDB. 

Main goals were to learn: 
- How to build a full API which includes handling of user input
- How to include error handling to return good validation errors
- How to build an API which works well with an existing frontend

The existing frontend was a twitter-like page where the user should post only happy thoughts. It also shows a count of likes/hearts on each thought. 

## The problem
- The setup for this Express API consists of a MongoDB stored in Atlas and deployed to Heroku 
- Using Mongoose for creating endpoints and manipulating the data 
- I have created one main thoughtSchema which defines the structure of the document, with default values for hearts and createdAt and with validators for the message.

I created the following endpoints:

https://sofias-happy-thought-api.herokuapp.com

GET /thoughts
--> To get all thoughts. With sorting to show the newest first and with limit to only show 20. 

POST /thoughts
--> Endpoint to add a new thought to the database. This endpoint expects a JSON body with the thought message.
It will only be saved if it fulfills the validations of being between minimum 5 and maximum 140 characters long. Error messages will be shown if the validation fails.

POST /thoughts/:thoughtId/like
--> This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its hearts property to add one heart. 

DELETE /thoughts/:id
--> Endpoint to delete a thought from the database based on id.

As I added the delete endpoint I also updated the frontend page to have a remove button.

## View it live

Deployed project on Netlify: https://sofias-happy-thoughts.netlify.app/
Deployed API on Heroku: https://sofias-happy-thought-api.herokuapp.com/
