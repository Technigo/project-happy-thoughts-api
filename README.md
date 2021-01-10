# Project Happy Thoughts API 💌

- In this week's project we used our new skills in Express and Mongodb to build an API which includes POST-request endpoints to create data, and GET-request endpoints to return data. We revisited our "Happy Thoughts" project from a couple of weeks ago, were we built a frontend in React which uses an API to store happy thoughts (in the previous project we built a frontend application with a form to post happy thoughts, list the most recent thoughts, and show a count of "hearts/likes" on each thought. Users could then click a heart to like a thought). 

- For this project, the task was to take this application one step further and build the API ourselves. Our own API is supposed to work in the same way, and become a drop-in replacement for the API we used in the previous project.


## The problem/How I solved it 👩‍💻

- I started out with creating a mongoose model called Thought with the properties message, hearts and createdAt. The message is a string with a given min- and maxlenght and is required, the hearts is a number that defaults to 0, and the createdAt property will return the current date and time when the thought is created. 

- The application has 3 endpoints: one endpoint to GET the 20 most recent thoughts (ordered by createdAt in descending order), another endpoint to POST a new thought to the database, and one endpoint to POST likes on a certain thought, validated by the thought id. 

- The API validates user input by returning errors if the input is invalid, for example if a thought is unabled to be saved to the database, or if a thought the user is trying to like is not found. In this case the response status is set to 400 (bad request).

## Tech ⚡️
- MongoDB
- Mongoose
- Express
- Node.js

## View it live ❤️

- API: https://emmas-happy-thoughts-api.herokuapp.com/
- App: https://happy-thoughts-project.netlify.app/
