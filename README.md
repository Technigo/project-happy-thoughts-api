# Project Happy Thoughts API

This week's project was aimed at using our new skills with Express and MongoDB to build an API which includes both GET request endpoints to return data and POST endpoints to create data. We were supposed to create our own Happy Thoughts API and connect it to our existing frontend that we built a couple of weeks ago.

## The problem

Some examples of how the user can use this API:

The user can fetch all posts through this endpoint, as well as post a new thought: 
https://project-happy-thoughts-api-xac4iwz3fa-lz.a.run.app/thoughts

I have applied pagination, letting the user decide how many posts will be viewable at once and step through pages (page 1 and limit 20 is default):
https://project-happy-thoughts-api-xac4iwz3fa-lz.a.run.app/thoughts?page=1&limit=20

And let the user sort the posts by different values and orders (createdAt and desc is default):
https://project-happy-thoughts-api-xac4iwz3fa-lz.a.run.app/thoughts?sortField=createdAt&sortOrder=desc

The user can view a single post through this endpoint:
https://project-happy-thoughts-api-xac4iwz3fa-lz.a.run.app/thoughts/6463dda65e61139a83f59492

And post a new like to a single post through this endpoint:
https://project-happy-thoughts-api-xac4iwz3fa-lz.a.run.app/thoughts/6463dda65e61139a83f59492/like


## View it live

Deployed API:
https://project-happy-thoughts-api-xac4iwz3fa-lz.a.run.app/

Connected frontend live link:
https://magnificent-granita-ca76e7.netlify.app/

Connected frontend code on Github:
https://github.com/mvfrid/project-happy-thoughts-api-frontend