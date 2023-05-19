# Project Happy Thoughts API
The aim for this project was to build an API mimicing an API used in a previous frontend project and structuring it so that the old URL-fetch could be replaced with the new one and still have the app working as before. The app is called Happy Thoughts and it lets you read, post and like new happy thoughts.

## The problem
I started off by examining the data structure of the old api and recreating the endpoints. After testing using the endpoints (GET and POST) in Postman, I replaced the old URL in the app. The GET-request worked directly, but the POST had some naming issues that had to be fixed. After that I added a enum category in my database for categorizing the happy thoughts. A dropdown select was then added to the frontend app and a [tag] for the category in the thoughts-list.

## View it live
The deployed version (API) can be found here:
https://project-happy-thoughts-api-on255rqxjq-lz.a.run.app/thoughts

The app is deployed here:
https://eloquent-bunny-a273b7.netlify.app/
