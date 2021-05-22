# Happy Thoughts API 💌

The goal for the project was using Express and Mongodb to build an API which includes both GET request endpoints to return data and POST endpoints to create data.
For the frontend I revisited my previous project _Happy Thoughts_ , a twitter like app where you can see other people's happy thoughts, post your own and give a ❤️ to an existing one.


## The project

The setup for this Express API consists of a MongoDB stored in Atlas and deployed to Heroku.
The main 'Thought' model have three properties: message, hearts & createdAt and some validations rules such as required and max- and min length.
All enpoints have a try/catch for error handling. If some input is invalid, a proper error message will show.


## Endpoints

### /
Root: List of the endpoints

### GET /thoughts
Displays the latest 20 thoughts, sorted by createdAt to show the most recent thoughts first.

### POST /thoughts
This endpoint expects a JSON body with the thought message, like this: { "message": "Express is great!" }

### POST /thoughts/:thoughtsId/like
This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its `hearts` property to add one heart.

### DELETE /thoughts
This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and delete it. (This endpoint was only for learning purposes and is not implemented in the frontend)


## Tech & Tools used ⛏💻

* Node.js
* MongoDB
* Mongoose
* Express


## View it live ❤️

Frontend: https://happy-thoughts-2021.netlify.app/
Backend (API) : https://annsofi-books-api.herokuapp.com/
