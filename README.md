# Project Happy Thoughts API

Some learing goals for this week included:
- How to use POST requests to send data to your API
- How to store data in your database from POST requests
- How to validate data and ensure your database only contains 'good' data
- How to build a full API which includes handling of user input
- How to build an API which works well with an existing frontend

These are my endpoints used in frontend: 

app.get: /thoughts (will return array of user post)
app.post: /thoughts (for saving and sending data to API)
app.post: /thoughts/:thoughtId/like (find thought by ID, and update its hearts property to add one like.)

Other endpoints in backend but not used in frontend:

app.get: /thoughts/:thoughtId
app.delete: /thoughts/:id (find thought by ID and delete it)
app.patch: /thoughts/:id (find thought by ID to update property)

## The problem

My main issue this week was starting up a previous project where my API was going to be used. After doing "npm start" outside of the projects' code folder different errors occured. After fixing it and then uploading to Netlify another error came up. I ended up deleting node modules, installing it again and lastly did a git push to update everything both in github and netlify.
If I had more time it would be to implement the different endpoints to the frontend project.    

## View it live

Deployed Heroku link: https://blooming-brushlands-33610.herokuapp.com/
Linked API to happy thought project: https://polite-gumption-c6b3c8.netlify.app/
