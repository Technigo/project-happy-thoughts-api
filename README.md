# Happy Thoughts

Built a Full Stack MERN Application from start to finish using React, Node.js, Express & MongoDB. The site is called "Happy Thoughts" and it is a twitter like application that allows users to read and add happy thoughts. As well as like thoughts
from other users and display the amount of likes each thought has. 

## The API

**GET** /thoughts endpoint returns an array with a maximum of 20 thoughts, displayed in descending order by the createdAt time.

**POST** /thoughts endpoint creates a new thought, which expects a JSON body with the thought message.

**POST** /thoughts/:id/like endpoint checks for a valid thought ID, if the API finds that thought by the ID, it will update 
its hearts property to add one heart.

## Hosted

Frontend hosted on Netlify: https://happy-thoughts-frontend.netlify.app/
Backend hosted on Heroku: https://happy-thoughts-mern.herokuapp.com/

