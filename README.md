# Project Happy Thoughts API
API built in Node using Express. MongoDB and Mongoose is used to store data. The backend is connected to a frontend of a previous project where data is listed and created by using GET and POST request methods.

The following endpoints are available:

- Root: /
- GET and POST thoughts: /thoughts
- POST like to thought: /thoughts/:id/like

## The problem
The backend was built to replace a working backend for a previous project, so I started by looking at the data the previous backend sent and received in Postman. That way I knew how to structure my model. 

If I had more time I would implement pagination, additional sorting and a name property enabling the user to enter a name if wanted.

## Learning objectives
- How to build a full API which includes handling of user input
- How to include error handling to return good validation errors
- How to build an API which works well with an existing frontend

## Technologies used
- Node.js
- Express
- MongoDB
- Mongoose
- JavaScript ES6

## View it live
- API: https://annas-happy-thoughts.herokuapp.com/
- Frontend: https://annas-happy-thought-app.netlify.app/
- Frontend repo: https://github.com/annatakman/project-happy-thoughts 
