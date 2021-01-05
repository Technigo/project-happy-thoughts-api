# Happy Thoughts API 💌

This project's main goal is to learn **POST requests**: expose users to my endpoints, allowing them to POST data to my API and then use that data to save new objects to my Mongo Database.

For this I'll be using the **"Happy Thoughts"** Frontend: this is a Twitter-like app including a form in which users can write a new 'happy thought', list recent thoughts, and it also shows a count of 'hearts' on each thought. Users can then click the heart to like a thought 💕
For this to work, I created an API in the Backend using **Express and MongoDB** including both GET request endpoints to return data and POST endpoints to create data 💪👩‍💻

**Find the Happy Thoughts Frontend live here:** https://happy-vane-thoughts.netlify.app/  
(and its repository here: https://github.com/VanessaSue27/project-happy-thoughts ) 💗

## How I built it - What I learned

- The setup for this Express API consists of a **MongoDB stored in Atlas and deployed to Heroku** 💥
- In order to create the endpoints and manipulate the data, I'm working with **mongoose**. I have one main model for 'Thought'. This schema includes various validation rules in order to control that the information saved to the database is clean. Super good learning how to validate the data on this project: I used properties like required, min and max length.
- I also learned how to implement **Pagination** using mongoose, which I use in my main GET endpoint which shows the 20 most recent Thoughts. This endpoint shows 20 Thoughts at a time (using limit()), starting with the most recent ones (using sort()).
- On my main POST endpoint to add a new Thought to the database, I managed to implement a new feature in which the user can **sign the tought**. So I'm sending both "message" and "username" properties to the databse when creating a new entry. If the username field is left empty, it will be automatically created as "Anonymous".
- All endpoints use a **try / catch** combination as well for error handling. If some input is invalid, a proper error message will show with some extra, handy information.

## Documentation - CORE ROUTES

Some useful details on the main endpoints of this API | Base URL: https://vane-happy-thoughts.herokuapp.com/ ✌

### GET /thoughts
Returns the 20 most recent Thoughts. These are sorted by the createdAt property. This endpoint also uses Pagination when a "page" query is added to the URL. If no "page" query is added, it will default to ?page=1. Make use of this query to access older thoughts in the database, for example: https://vane-happy-thoughts.herokuapp.com/thoughts?page=3

### POST /thoughts
Endpoint to add a new Thought to the database. It expects a JSON body with the Thought's "message" and "username", like this:

{ message: "Programming is so much fun!", username: "Vanessa" }
If the username field is empty, it will default to Anonymous.

If the input is valid (message must be between 5 - 140 characters), the thought will be saved and you will get a response showing the Thought object that was just created. If the input is invalid, you'll get an error message explaining what went wrong.

### POST /thoughts/:thoughtId/like
This endpoint does not require a JSON body. Given a valid thought id in the URL, the API should find that thought and update its hearts property to add one heart. If the id is invalid, an error message will show.

## View it live

💗 Happy Thoughts API 💗 is live - powered by Heroku here: https://vane-happy-thoughts.herokuapp.com/
