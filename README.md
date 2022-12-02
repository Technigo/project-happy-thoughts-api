# Project Happy Thoughts API
A Twitter-inspired backend project with the goal of practicing POST requests and the connection to the frontend.

- Tested through MongoDB Compass and Postman.
- Deployed via Google Cloud and MongoDB Atlas.
- ThoughtSchema with the following properties: message (thought), name, hearts (likes), createdAt

## Endpoints 

- /thoughts
GET (retrieve all thoughts, sort them by date (newest first) and display only the last 20)
POST (retrieve the info from the input fields to the API endpoint)
- /thoughts/:thoughtId/like
POST (update a thought's likes upon clicking on the heart)
## View it live
- Backend: https://project-happy-thoughts-api-7jpb7hb2ja-lz.a.run.app/
- Frontend: https://happy-thoughts-antonella.netlify.app/
