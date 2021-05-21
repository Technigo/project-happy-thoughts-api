# Project Happy Thoughts API ❤️
This project's main goal is to learn GET  & POST requests: expose users to the endpoints, allowing them to POST data to my API and then use that data to save new objects to my Mongo Database.

The frontend for this project has previously been created, so final step was to connect the backend 

You find repository here: https://github.com/Sartish/project-happy-thoughts 💗

## The built 🛠
I created an API in the Backend using Express and MongoDB including GET request endpoints to return data and POST endpoints to create data stored in MongoDB

I Started of by building a `Thought` Mongoose schema as a model which has properties for the `message` string, a `heart` property for tracking the number of likes, and a `createdAt` property to store when the thought was added.

Then three endpoints were created

### `GET /thoughts`

This endpoint should return a maximum of 20 thoughts, sorted by `createdAt` to show the most recent thoughts first.

### `POST /thoughts`

This endpoint expects a JSON body with the thought `message`, like this: `{ "message": "Express is great!" }`. If the input is valid (more on that below), the thought should be saved, and the response should include the saved thought object, including its `_id`.

### `POST thoughts/:thoughtId/like`

This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its `hearts` property to add one heart.

### The thought model

We mentioned the `Thought` model and its properties a bit earlier. Each of these properties has some special rules or validations which you must implement to make a good API for the frontend:

- `message` - the text of the thought

→ Required

→ Min length of 5 characters

→ Max length of 140 characters

- `hearts` - the number of heart clicks this thought has received

→ Defaults to `0`

- `createdAt` - the time the Thought was added to the database

→ Defaults to the current time

→ Should not be assignable when creating a new thought

Endpoints: 
https://saras-happy-thought.herokuapp.com/
GET and POST 
https://saras-happy-thought.herokuapp.com/thoughts
Likes: 
https://saras-happy-thought.herokuapp.com/thoughts/${_id}/likes

## Tech ⚡️
- MongoDB
- Mongoose
- Node.js
- Express

## View it live

API: https://saras-happy-thought.herokuapp.com
Frontend application: https://only-happy-thoughts.netlify.app/




