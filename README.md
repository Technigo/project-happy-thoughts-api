# Project Happy Thoughts API ❤️

This is a project I made when doing the Technigo bootcamp (autumn 2020). The project was to practice my skills with Express and Mongodb to build an API which includes both GET request endpoints to return data and POST endpoints to create data.

The API lets you view messages with GET requests and send and like messages with POST requests.

## The problem 💡

Describe how you approached to problem, and what tools and techniques you used to solve it. How did you plan? What technologies did you use? If you had more time, what would be next?

## Tech 🛠

- Node.js
- Express
- MongoDB
- Mongoose

## View it live

The API can be found on Heruko: https://lindas-project-happy-thoughts.herokuapp.com/

### Endpoint documentation:

//GET

https://lindas-project-happy-thoughts.herokuapp.com/thoughts - show all happy thoughts (max 20 limit)

//POST

https://lindas-project-happy-thoughts.herokuapp.com/thoughts - send thought (min 5 and max 140 character limit)

https://lindas-project-happy-thoughts.herokuapp.com/thoughts/id/like - send heart/like the thought, replace id with the id of the thought
