# Project Happy Thoughts API

The purpose of this project was to use our new skills with Express and Mongodb to build a RESTful API which includes both GET request endpoints to return data and POST endpoints to create data.

This time, we had to create an API similar to the one built by Technigo that we used for our project on week 11 and to update the URL to the API in the frontend code, from the Technigo one to the one we deployed.

## The problem

Following the brief, I first created a `Thought` Mongoose model containing properties for the `message` string, the `hearts` number tracking the number of likes and the `createdAt` date storing the creation date.
Then I created the `POST /thoughts` endpoint and tested it using Postman. I made sure that the `message` property was the only one that could be populated using this endpoint and I improved the `Thought` Mongoose model with a set of validation rules.
Then I created a `GET /thoughts` endpoint to retrieve the 20 latest thoughts stored in the database.
At last, I created the `POST thoughts/:thoughId/like` endpoint which increase the likes count of the selected thought.
I deployed the API to Heroku and made a [copy](https://github.com/MindstormingAB/happy-thoughts) of my previous Happy Thoughts project where I replaced the fetched URL's by the ones I just created. The idea was that, if I built this API correctly, the only thing I would need to change in the frontend code was the URL to the API, from the Technigo one to the one I just deployed. And it went well!

In addition to these minimum requirements, I added 2 properties (`author` and `category`) in the `Thought` Mongoose model and updated the `POST /thoughts` endpoint accordingly.
Since I wanted to be able to filter thoughts by author or/and category, I had to create additional endpoints using Mongoose's aggregate functions `$group`and `$out`:
- `GET /authors` that updates the `authors` collection with an unique occurence for every author   
- `GET /categories` that updates the `categories` collection with an unique occurence for every category
I even improved the `GET /thoughts` endpoint by allowing query params, so the frontend could filter the thoughts by author and/or category.

If I had more time, I would have implemented pagination.

## View it live

You can take a look at the result on https://happy-thoughts-by-m.herokuapp.com/
You are welcome to visit my pull request https://github.com/Technigo/project-happy-thoughts-api/pull/115 and leave some comments about my code.
You will find the frontend deployed on https://happy-tweets-by-m.netlify.app/, the repository on https://github.com/MindstormingAB/happy-thoughts.
Enjoy!
