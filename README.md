# Project Happy Thoughts API

This week's project is to use Express and MongoDB to build an API which includes both GET request endpoints to return data and POST endpoints to create data.

For this project I have built a frontend that has a form to write a new 'happy thought', lists recent thoughts, and shows a count of 'hearts' on each thought. Users could then click the heart to like a thought. 
Find the Happy Thoughts Frontend live here: https://happy-thoughts-app.netlify.app/
(and its repository here: https://github.com/Irina-web-dev/project-happy-thoughts) 

## The problem

◼ The setup for this Express API consists of a MongoDB stored in Atlas and deployed to Heroku.

◼ I created different endpoints by manipulating the data with mongoose. I have one main model for 'Thought' with schema that includes various validation rules such as required, minlenght, maxlenght, unique, trim in order to control that the information saved to the database is valid. To test my endpoints I used Postman.

◼ I am handling errors with try & catch combination. If some input is invalid, a proper error message will show.

## Documentation - ROUTES

### BASE URL
    showing useful details on the main endpoints of this API: https://app-happy-thoughts.herokuapp.com/


### GET /thoughts
This endpoint return a maximum of 20 thoughts, sorted by createdAt to show the most recent thoughts first.

### POST /thoughts
This endpoint expects a JSON body with the thought `message`, like this: `{ "message": "Express is great!" }`. If the input is valid (message must be between 5 - 140 characters), the thought should be saved, and the response should include the saved thought object, including its `_id`. If the input is invalid, you'll get an error message explaining what went wrong.

### POST /thoughts/:thoughtId/likes
This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API finds that thought, and update its hearts property to add one heart. If the id is invalid, an error message will show.

## View it live

Happy Thoughts API deployed with Heroku here:: https://app-happy-thoughts.herokuapp.com/
