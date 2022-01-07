## Project Happy Thoughts API

A Twitter-inspired backend project with the goal of practicing POST requests and the connection to the frontend.

The user inputs data through the frontend (link at the end of this document). It is then stored, displaying the first 20 user inputs ("thoughts").

NOTE: The UI is based on Technigo's own design. The assignment was to reproduce the wireframe as closely as possible.

# Features

- `ThoughtSchema` with the following properties: message (thought), name, hearts (likes), createdAt
- Input validation with error handling
- Optional user name input
- Tested through MongoDB Compass and Postman
- Deployed via Heroku and MongoDB Atlas

# Endpoints and requests

- `/` (default)
  - Welcome message. Instructs the user to type the path to the next endpoint.
- `/thoughts`
  - **GET** (retrieve all thoughts, sort them by date (newest first) and display only the last 20.
  - **POST** (retrieve the info from the input fields to the API endpoint)
- `/thoughts/:thoughtId/like`
  - **POST** (update a thought's likes upon clicking on the heart)

# Challenges and lessons learned

- The connection from the frontend to the backend took a while to figure out. This kept the app from deploying correctly. The reasons were the following:
  - Forgetting to declare `config vars` in Heroku.
  - A naming inconsistency between the frontend (`hearts`) and the backend (`heart`).
- Managing several inputs (message and user name) through a single handler was difficult. I was created a separated component for the user input at first. But then some classmates suggested simply adding it to the general form. This helped.
- I still need to figure out how to reset the user name input at the same time.

## View it live

Backend: https://happy-thoughts-api-isabel.herokuapp.com/thoughts
Frontend: https://isabel-gonzalez-happy-thoughts.netlify.app/
