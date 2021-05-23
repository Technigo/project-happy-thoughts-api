# Project Happy Thoughts API

This project i practised using Express and MongoDB to build an API which includes GET request endpoints to return data and POST endpoints to create data. 
I have learned:
*How to build a full API which includes handling of user input
*How to include error handling to return good validation errors
*How to build an API which works well with an existing frontend

## The assignment
I started out by creating a thoughtSchema to define the structure of the document. I added default values and validators for the posted thought. 

 Path | Description |
| --- | --- |
|GET "/thoughts" | Endpoint to get all thoughts. I used .sort() and .limit() to get the newest thoughts and limit to 20 thoughts. |
| POST  "/thoughts" | Endpoint to post thoughts which expects JSON body with a thought message. I added validation to require a message, minimum message length of 5 characters and maximum length of 140 characters. If message does not meet the validation requirements, appropriate error message will be given.|
| POST "/thoughts/:id/likes" | Endpoint to increase heart likes on a specific thought id. |

I also have a DELETE endpoint, which I do not use at the moment. When given more time I would like to use this endpoint where in the frontend you could delete a thought with a specific id. That is why i have choosen to keep this endpoint to continue my work. 

When given more time I would like to implement a delete button in the frontend to delete a thought. I would also like to add the functionality of the user to enter their name by adding a new property on the thought model.

## View it live

https://anna-happy-thoughts.herokuapp.com/
https://no-bad-thoughts-inc.netlify.app/