# Project Happy Thoughts API

Backend project making a custom database with MongoDB/Mongoose for connecting to previous Happy Thoughts project.

## The problem

Connected my database at the start with the project and used postman and mongoDB compass for testing. Had to push to github all through development because my local database just kept on crashing, might be something with my mac m1. So there's alot of "test" commits in this project.
Deployed to heroku and connected the new URL to https://github.com/dandeloid/project-happy-thoughts.

Added endpoints with methods:

GET - List messages limited to 20
POST - Create thought messages
POST - Adding likes/hearts for messages
DELETE - Remove message
PATCH - Change message

## View it live

backend: https://happy-t-api.herokuapp.com/thoughts
frontend: https://vibrant-poincare-2ba27b.netlify.app/
