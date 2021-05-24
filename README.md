# Project Happy Thoughts API

This is the backend of an app called Happy thoughts. The app allows you to post a thought and like the existing thoughts. I have built the frontend in an earlier project. The purpose of this project was to practise setting up an API that allows users to POST data to a database in MongoDB. It is built using Node.js with Express and MongoDB with Mongoose.

## The problem

I used Mongoose methods from the lectures. The endpoints worked when I tried them locally. Then I had trouble deploying. I got an error trying to look at the Heroku endpoint and I didn't see any collection in my MongoDB Atlas cluster. After much trouble shooting together with a team mate, it turned out I shouldn't have quotes around my connection string in the config vars in Heroku settings. Removing them, it worked! I Also had a little trouble getting the like feature to work when I connected this backend to my frontend. But it turned out there was a missing slash in the endpoint URL.

## View it live

### ENDPOINTS

https://linneas-happy-thoughts.herokuapp.com/thoughts 
Use with GET to return 20 latest thoughts sorted chronologically by creation time.
Use with POST to add a thought. This endpoint expects a JSON body with the thought message, like this: { "message": "Express is great!" }.

https://linneas-happy-thoughts.herokuapp.com//thoughts/:id/likes
This endpoint doesn't require a JSON body. Given a valid thought id in the URL, the API should find that thought, and update its hearts property to add one heart.

### FULLSTACK PROJECT
https://happy-thoughts-indeed.netlify.app/ 

Here is the frontend I had made earlier connected to the backend of this project.


