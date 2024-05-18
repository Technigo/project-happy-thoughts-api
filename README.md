# Project Happy Thoughts API

This project builds the backend for [Happy Thoughts project](https://github.com/wwenzz/project-happy-thoughts-vite) by creating RESTful API. This backend has the following endpoints:

- "/": Display a list of endpoints served by the backend.
- "/thoughts": Offer GET and POST requests that display all thoughts and post a single thought individually.
- "/thoughts/:id/like": Like a post based on the post id. Always increment by 1.
- "/thoughts/:id/unlike": Unlike a post based on the post id. Always decrement by 1 and cannot apply on posts with 0 hearts.

## The problem

- POST request: Retreived the request body and used mongoose findByIdAndUpdate as well as findOneAndUpdate methods to post new data.
- Error handling: Implemented try and catch block to catch any potential errors and further customise the error messages.
- Response limit & sorting: Applied limit and sort methods from mongoose to limit and sort the responses.

## View it live

https://wen-happy-thoughts-api.onrender.com/
