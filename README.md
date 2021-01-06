# Project Happy Thoughts API

Replace this readme with your own information about your project.

Start by briefly describing the assignment in a sentence or two. Keep it short and to the point.

How to use POST requests to send data to your API
How to store data in your database from POST requests
How to validate data and ensure your database only contains 'good' data

This week's project is to use your new skills with Express and Mongodb to build an API that includes both GET request endpoints to return data and POST endpoints to create data.

In the Happy Thoughts project, you built a frontend in React which uses an API we created to store thoughts. For this project, we want you to build your own API which works in the same way and should become a drop-in replacement for the API you used in the React frontend.

We built a frontend that has a form to write a new 'happy thought', lists recent thoughts, and shows a count of 'hearts' on each thought. Users could then click the heart to like a thought. It looked like this:

In order to replace the API we built, you're going to need to build a `Thought` Mongoose model which has properties for the `message` string, a `heart` property for tracking the number of likes, and a `createdAt` property to store when the thought was added.

Then, you'll need to add 3 endpoints:
We mentioned the `Thought` model and its properties a bit earlier. Each of these properties has some special rules or validations which you must implement to make a good API for the frontend:

- `message` - the text of the thought

    → Required

    → Min length of 5 characters

    → Max length of 140 characters

- `hearts` - the number of heart clicks this thought has received

    → Defaults to `0`

    → Should not be assignable when creating a new thought. For example, if I send a POST request to `/` to create a new thought with this JSON body; `{ "message": "Hello", "hearts": 9000 }`, then the `hearts` property should be ignored, and the object we store in mongo should have 0 hearts.

- `createdAt` - the time the Thought was added to the database

    → Defaults to the current time

    → Should not be assignable when creating a new thought

## The problem

Describe how you approached to problem, and what tools and techniques you used to solve it. How did you plan? What technologies did you use? If you had more time, what would be next?

## View it live

Every project should be deployed somewhere. Be sure to include the link to the deployed project so that the viewer can click around and see what it's all about.
