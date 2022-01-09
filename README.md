# Project Happy Thoughts API
I created my own database for the Happy Thoughts project I did as a frontend project during the TEcnigo's Bootcamp.
I used MongoDB/Mongoose schema and Express.


FEATURES: 
- `GET /thoughts` endpoint returns 20 results, ordered by `createdAt` in descending order.
- `POST /thoughts` endpoint is used to create a new thought, if the input was invalid and the API is returning errors, it sets the response status to `400` (bad request).
- `POST /thoughts/:id/like"` endpoint is used to increase the number of likes
- The endpoint to add hearts to a thought returns 'the thought not found' error if the thought was not found.
- API validates user input and returns appropriate errors if the input is invalid.




TECH STACK: Nodejs, Express, Mongoose Library, Mongo DB Atlas and Heroku to deploy 

## View it live

backend: https://happy-thoughts-api-pde.herokuapp.com/ 

frontend: https://happy-thoughts-pinar.netlify.app 
