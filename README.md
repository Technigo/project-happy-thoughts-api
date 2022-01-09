# Project Happy Thoughts API

In this project, I have used Express and MongoDB to build an API that includes both GET request endpoints to return data and POST endpoints to create data.

## Endpoints

GET /
Welcome page

GET /thoughts
Returns 20 messages in the database, sorted to show the most recent messages first.

POST /thoughts
This endpoint expects a JSON body with the thought message, like this: { "message": "Express is great!" }. If the input is valid, the thought will be saved.
→ Min length of 5 characters
→ Max length of 140 characters

PATCH /thoughts/:thoughtId/like
Given a valid thought id in the URL, the API finds that thought, and updates its hearts property to add one heart. An error message will show when the id is invalid or no message is found with the provided id.

## View it live

https://amandatilly-happy-thoughts-api.herokuapp.com/
