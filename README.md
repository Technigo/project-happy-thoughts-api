# Project Happy Thoughts API

This is an API made for another project, the happy thoughts project. The user can write and post a happy thoughts or like an existing one.


## The problem

I started to build a mongoose model with properties for the messsage string and the number of likes. There is also a createdAt property to store when the thought was added.
Then, I created 3 endpoints:

### `GET /`

This endpoint returns a maximum of 20 messages, sorted by date to show the most recent thoughts first.

### `POST /`

This endpoint expects a JSON body with a message, like this: { "message": "This is my happy thought!" }. If the input is valid, the thought will be saved to the database and a response will be sent back with the saved thought object and an id.

### `POST /:messageId/like`

This endpoint will update when you like an existing happy thought. Given a valid id in the URL, the API should find that post, and increase the number of likes with 1.

After this I had to make a few changes in the frontend to connect my happy thought page to my new API. The most difficult part of this project was the deploy and to get the connection between the project, Mongo DB Cloud Atlas and Heruko to work.

## View it live

Frontend:
https://project-happy-thoughts.netlify.app/

Backend:
https://happythoughts-api.herokuapp.com/


