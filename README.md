# Project Happy Thoughts API 💌

I've built my own version of Twitter (RESTful API) using a database to store the happy thoughts! I used MongoDB for the database, mongoose for the modelling of data and Express.js (Node.js framework).

I've also got a frontend to go with this API, which makes this my very first fullstack application! 😍

## The problem

The main task was to build a RESTful API and to use a database to store the data (thought or hearts on an existing thought) that is POSTed, and the possibility to GET the thoughts.

I started with setting up the database using MongoDB and built a mongoose model for the thought which has a set of properties, for instance the message, hearts and createdAt, with validations to them. With the database and model ready, I began building the different endpoints and request methods I would need for the application (see documentation below for the full list). 

I've also implemented error handling throughout the project. For instance, the user will get an appropriate error message and response status to every request. Furthermore, I've implemented try and catch blocks in the code. 

I've also added the possibility for the user to enter a username (or remain anonymous, which will be what is shown on the message if no user is filled in) and a tag, which will be displayed in the thought. A user can also edit a POSTed message and then update it (PATCH request).

I chose to use the npm package express-list-endpoints to list the endpoints in the home ('/') endpoint. I continuously tested my API using Postman and checked out my database using MongoDB Compass. 

If I had more time I would do the following,
- Add filtering and sorting options to the endpoint which returns all thoughts. That way the user could choose to sort by oldest first, or only show thoughts which have a lot of hearts
- Implement infinite scrolling on the frontend using the react-infinite-scroller package


## View it live

* Link to my deployed API: https://project-happy-thoughts-isabm5.herokuapp.com/ 
* Link to my deployed fullstack application: https://heuristic-bassi-e1a3f1.netlify.app/ 

## Documentation

### ENDPOINTS

Displays all endpoints for this API using npm package express-list-endpoints.
- ```GET /```


### THOUGHTS

Endpoint for several thoughts.
- ```GET /thoughts```
- ```POST /thoughts```


### SINGLE THOUGHT

Endpoint for a single thought.
- ```GET /thoughts/:thoughtId```
- ```DELETE /thoughts/:thoughtId```
- ```PATCH /thoughts/:thoughtId```
- ```PUT /thoughts/:thoughtId```

Endpoint for a single thought to POST a like on a specific thought.

- ```POST /thoughts/:thoughtId/like```