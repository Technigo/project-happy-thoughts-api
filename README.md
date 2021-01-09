# Project Happy Thoughts API

Backend part for the Happy Projects frontend project: https://github.com/ankimelin/project-happy-thoughts, including a database (MongoDB) and an API on top of that (Mongoose).

## The problem

After thinking about which endpoints to build and what those should do, I implemented those one at a time, testing each and every endpoint in Postman before moving on to the next one. 

Next step: bring error messages from backend to frontend, and implement sort endpoints as well as pagination.

## View it live

https://happy-thoughts-annika.herokuapp.com/

Endpoints:

https://happy-thoughts-annika.herokuapp.com/thoughts - get and post requests

https://happy-thoughts-annika.herokuapp.com/thoughts/:id - delete, put and patch (updates message of thought object) requests

https://happy-thoughts-annika.herokuapp.com/thoughts/:id/like - post request for liking a thought
