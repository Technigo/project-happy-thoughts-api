# Project Happy Thoughts API

I this project, I built an API for a frontend project I built a couple of weeks ago: https://github.com/HenrikeW/project-happy-thoughts
It's a twitter-like service to send, read and like happy thoughts. 
I built this project as part of the Technigo bootcamp for frontend developers in January 2021.

## What it does

The API has three endpoints:
- GET /thoughts to get a list of the most recently posted happy thoughts. The list will be limited to 20 thoughts. 
- POST /thoughts to add a new thought to the database
- PUT  /thoughts/:id/like to like a thought from the database

## The approach

When I started creating this API I already had a frontend that I had built to match a dummy API provided by my tech school. The goal was now to build my own API to match the frontend immediately. Thus, I only needed to change the URL paths in the frontend to connect it with my newly built API. 

That also means that I followed the design of the dummy API and created the endpoints according to that. However, I changed the endpoint to like a post from being a POST endpoint to a PUT endpoint, as the number of likes is not added newly to the database but rather updated. 

## Limitations

In the current design, the PUT endpoint for the likes allows the user to directly change the number of likes and while doing that overwrite the old number of likes. In the future I might change the database design and create another collection to store the likes seperately and connect it to the collection of thought-messages in the database. That would make it possible to trace every single like and e.g. give it a timestamp. The way to send a like would then be through a POST endpoint.

## Tech used

- ES6
- Express
- Mongo DB
- Mongoose

## View it live

You can access the API here: 
