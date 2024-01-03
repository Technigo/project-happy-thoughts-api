# Project Happy Thoughts API

This project was a deep dive into creating and deploying a full-stack application. The backend is built with Node.js and Express, connected to a MongoDB Atlas database, and the frontend is deployed on Netlify. This project allowed me to learn and experiment with POST and GET requests, and effectively utilize Postman for testing.

## The problem

I had some challenges initially with getting POST requests to work after adding my MongoDB Atlas key. I rolled back to a previous version, made necessary adjustments, and everything fell into place.

Figuring out CORS was a bit challenging. After adding my Netlify URL to the allowed origins, my deployed version started working as intended. A valuable lesson was learning that local testing doesn't always reflect the deployed environment.

I feel like I really got the "hang" of postman during this project, so that was fun. It enhanced my understanding of API testing. During this project I got to experiense how to use the API we make, as I have mentioned previously that I dont understand how we will use it. Now I know. 



## View it live

https://happy-api-ec.onrender.com

https://happy-thoughts-elbine.netlify.app/


## Postman

http://localhost:1313/thoughts (GET - (body - none)) 
//get all thoughts in postman

http://localhost:1313/thoughts/65946218dcd930500af56dd0/like (POST - (body - none(?))
// http://localhost:1313/thoughts/ThoughtIDhere/like
// This is to test if giving likes workes in postman

http://localhost:1313/thoughts (POST - (body - raw - JSON))
//post a thought in postman 
<!-- {
  "message": "testing happy"
} -->
