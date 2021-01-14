# Happy Thoughts API 💌
This project's goal was to build an API which includes both GET request endpoints to return data and POST endpoints to create data. For the front end I revisited my previous project _Happy Thoughts_ a twitter like app where you can see other people's happy thoughts, post your own and give a ❤️ to an existing one. 
You can see the live version here, feel free to leave me some happy thoughts! [_Happy Thoughts_](https://happythoughts-sofia.netlify.app/)

## Planning & What I learned 🧩

- This Express API consists of a **MongoDB stored in Atlas and deployed to Heroku** 
- My first step in this project was to create the mongoose model for the _Thought_, the model schema consists of three main components: message, hearts and createdAt, with several validation rules embedded, i.e. _required_. 
- Used _try_ and _catch_ in all endpoints for error handling. 

## Endpoints 💫
### / 
Root: Welcome page 
### GET /thoughts
Displays the latest 20 thoughts, sorted by createdAt to show the most recent thoughts first.
### POST /thoughts
Endpoint to post and save a new thought to the database. It expects a JSON body with the thought message, like this: { "message": "Happy New Year!" }
### POST /thoughts/:thoughtId/like
This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its hearts property to add one heart.

## Tech ⚡️
- MongoDB
- Mongoose
- Node.js
- Express

## View it live 🔴
[Happy Thoughts API 💌](https://happy-thoughts-sofia.herokuapp.com/)
