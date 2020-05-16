# Project Happy Thoughts API

API built in Node using Express. MongoDB and Mongoose is used to store data. The backend is connected to a frontend of a previous project where data is listed and created by using `GET` and `POST` request methods.

The following endpoints are available:
- Root: `/`
- GET and POST thoughts: `/thoughts`
- POST like to thought: `/thoughts/:id/like`

Queries are used to sort and paginate the frontend:
- Sort by newest, oldest, most loved, e.g. `/thoughts?sort=newest`
- Select page, e.g. `/thoughts?page=2`

## The problem

Seeing as the backend was built to replace a working backend for a previous project, I started by looking at the data it sent and received in Postman. That way I knew how to structure my model. After the DB was running and connected to the frontend, I implemented pagination, additional sorting and a name property enabling the user to enter a name if wanted. All are implemented to both back- and frontend.

If I had more time I would look at a filtering function to only display thoughts by named/anonymous users and displaying only liked/not liked thoughts. It would also be nice to implement login functionality.

## Learning objectives

- How to build an API which includes handling of user input
- How to include error handling to return good validation errors
- How to build an API to work with an existing frontend

## Backend Tech

- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript ES6

## View it live

- API: https://fridamaria-happy-api.herokuapp.com/
- Frontend: https://fridamaria-happy-thoughts.netlify.app/
- Frontend repo: https://github.com/fridamaria/project-happy-thoughts
