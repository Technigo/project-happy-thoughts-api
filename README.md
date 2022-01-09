# Project Happy Thoughts API

In this project, I have created an API with several endpoints for a previuos frontend project (Happy Thoughts project). Instead of using the API given from Technigo, I have created my own one.

Features:

- GET request to get all thoughts:
(https://happythoughts-project-api.herokuapp.com/thoughts)

- POST request to add new thoughts:
(https://happythoughts-project-api.herokuapp.com/thoughts)

- POST request to increase the number of likes:
https://happythoughts-project-api.herokuapp.com/thoughts/:thoughtsId/like

- DELETE request to erase messages:
https://happythoughts-project-api.herokuapp.com/thoughts/:thoughtsId/delete

I started by creating a model and a schema, to specify different validation for the properties. I created then the POST request to add new thoughts and increase the amount of likes. The GET request to display the thought is sorted by decreasing dates and has a limit of 20 thoughts. The POST requests have error handling.

## View it live

Link to the frontend website: https://nifty-blackwell-f65e37.netlify.app/

Visit my deployed API here: https://happythoughts-project-api.herokuapp.com/