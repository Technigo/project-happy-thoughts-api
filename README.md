# Happy Thoughts API

By using Express and MongoDB I built an API for posting and likeing comments on a small "twitter-like" front-end project I recently built.

## The problem

This was done by building a Mongoose model for the the thoughts (the posts) with the properties for the message string, a heat property for tracking the number of likes, and a createdAt property to store when a thought was added. I created three endpoints for returning all thoughts, posting a new thought and updating the number of likes for a post.

## View it live

The deployed project:
https://happy-thoughts-emmy-dieden.onrender.com

The frontend project where the API is used:
https://happy-thoughts-emmy-dieden.netlify.app/
