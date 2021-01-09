# Project Happy Thoughts API
During this project I learned to build my own backend API and database and connect it to an already existing front end (and how to modify the frontend to new functionality on the backend).

Avaialble endpoints:

Root: /
Get list of 20 thoughts in descending order: GET /thoughts
Post a thought: POST /thoughts
Like a thought: POST /thoughts/:id/like

Endpoints can be found here: https://happy-thoughts-hanna.herokuapp.com

## Stretch goals
Sorting options of thoughts using query param in backend and select drop-down in frontend.
Sorting options:
- Newest posts first (default)
- Oldest posts first
- Posts with most likes first

User can enter their name when posting a thought. This is added to the mongoose model and displayed in the frontend when the user posts a message. The name input is optional when posting, and if user don't add a name the default name in "Anonymous".  

## Tech used
- Mongo DB
- Mongoose
- Mongo Atlas
- Mongo DB Compass
- Node.js
- Express
- Heroku
- Postman
- JSX
- Javascript
- React
- CSS

## What I learned
- How to build an API that handles GET and POST requests from the user and saves data to the database.
- How to sort data using query-param based on user interaction on the front end.
- How to handle errors and return appripriate error-messages.
- How to handle validation of user input both on the frontend and the backend API.

## View it live
The project started out as an only front-end app, which can be found here: https://hannas-happy-thoughts-app.netlify.app

For this project I modified the front-end and made my own API.

Link to new, updated front-end: https://hanna-happy-thoughts-new-version.netlify.app
Link to API: https://happy-thoughts-hanna.herokuapp.com/thoughts



