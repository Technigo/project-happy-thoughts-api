# Project Happy Thoughts API

In this project, I have created an API with several endpoints for a previuos frontend project (Happy Thoughts project). Instead of using the API given from Technigo, I have created my own one.

I started by creating a model and a schema, to specify different validation for the properties. I created then the POST request to add new thoughts and increase the amount of likes. The GET request to display the thought is sorted by decreasing dates and has a limit of 20 thoughts. The POST requests have error handling.

FEATURES:

- GET request to allow the user to retrive a maximum of 20 thoughts that has been sorted by createdAt and will show the most recent thoughts first.
(https://happythoughts-project-api.herokuapp.com/thoughts)

- POST request to allow the user to add new thoughts: /thoughts

- POST request to allow the user to increase the number of likes: /thoughts/:thoughtsId/like

- DELETE request to allow the user to delete a message based on the given id: /thoughts/:thoughtsId/delete

TECH STACK:
Node.js
Express framework
Mongoose library
MongoDB Atlas / Heroku


## View it live

Link to the frontend website: https://my-happy-thoughts-place.netlify.app/

Visit my deployed API here: https://happythoughts-project-api.herokuapp.com/