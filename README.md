# Project Happy Thoughts API

Routes:

"GET /thoughts - This endpoint returns a maximum of 20 thoughts, sorted by 'createdAt' to show the most recent thoughts first."

"POST /thoughts - This endpoint expects a JSON body with the thought 'message', like this: { \"message\": \"Express is great!\" }. If the input is valid the thought is saved. If the input is invalid and the API is returning errors, the response is `400` (bad request).

"POST thoughts/:thoughtId/like - This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API updates its 'hearts' property to add one heart."

## The technologies used

API using MongoDB and express hosted on heroku.

## View it live

api
https://project-happythoughts-api.herokuapp.com/

frontend
https://all-the-thoughts.netlify.app
