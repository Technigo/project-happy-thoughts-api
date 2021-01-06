# Project Happy Thoughts API ❤️

In this project I use Express and Mongodb to build an API that includes both GET request endpoints to return data and POST endpoints to create data.


## View it live 👀

https://project-happy-thoughts-anna.herokuapp.com/

https://inspiring-lalande-9954d9.netlify.app/


## Learnings 🤓

- How to use POST requests to send data to your API
- How to store data in your database from POST requests
- How to validate data and ensure your database only contains 'good' data


## Making it work 👍

In my earlier project - Happy Thoughts - I built a frontend in React which uses an API I created to store messages. In this new project, I have built my own API which works in the same way and I used that one to replace the API I used before in the React frontend.

In the first project I built a frontend that has a form to write a new 'happy thought', lists recent thoughts/messages, and shows a count of 'hearts' on each message. Users could then click the heart to like a message.

In order to replace the API I built, I build a 'Message' Mongoose model which has properties for the 'message' string, a 'heart' property for tracking the number of likes, and a 'createdAt' property to store when the message was added.

I then added 3 endpoints.

Each of the Message model's properties has special rules/validations:

- 'message' - the text of the message

    - Required
    - Min length of 5 characters
    - Max length of 140 characters
    
    
- 'hearts' - the number of heart clicks this message has received

    - Defaults to '0'
    - Should not be re-assignable

- 'createdAt' - the time the message was added to the database

    - Defaults to the current time
    - Should not be re-assignable

