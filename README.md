# Project Happy Thoughts API

This week we built an API with 3 endpoints to replace the public API we used in our previous project Happy Thoughts: 
https://github.com/Kras053/project-happy-thoughts

The routes are:
"/thoughts": "(GET request) Get the 20 most recent happy thoughts, sorted in descending order",
      "/thoughts": "(POST request) Post a new happy thought",
      "/thoughts/:thoughtId/like": "(POST request) finds a happy thought from the ID and updates it with one like",

## The problem
This was accomplished by building a `Thought` Mongoose model whith properties for the `message` string, a `heart` property for tracking the number of likes, and a `createdAt` property to store when the happy thought was added.

The 'message' string gives us the text of the thought, and it also has the properties required, minimum of 5 characters and maximum length of 140 characters. 
The 'hearts' property gives us the number of heart clicks/likes the specific thought has received, with a default of 0 and ignoring any other number of likes if assigned in the JSON body with the posted message.
The 'createdAt' property gives us the time the happy thought was added to our database and should not be assignable either. 
    
- The GET /thoughts endpoint returns 20 results, ordered by 'createdAt' in descending order by using the .find(), .sort() and .limit() methods.
- The POST /thoughts endpoint posts a new happy thought. If the requirements are not met it returns errors for min/max length and sets the status to 400 (bad request).
  If met it returns 201 status message.
- The POST/like returns an error if the thought was not found and sets the response status to 400 (bad request).

I hade an issue with the hearts requirement of default 0 for likes on a new happy thought, so when I wrote 'hearts':555 in the JSON body in Postman it added the likes to the post. I solved it by removing the heart argument called in the /thoughts path, making the POST request ignore this as it should. 

## View it live
https://send-happy-thought-api.herokuapp.com/
