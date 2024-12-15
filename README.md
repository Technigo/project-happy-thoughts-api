# Project Happy Thoughts API

We had to create our own Api for our previous project Happy thoughts, where we sent thoughts and like it in a local host

## The problem

Describe how you approached to problem, and what tools and techniques you used to solve it. How did you plan? What technologies did you use? If you had more time, what would be next?

I identified the key API endpoints and the required data model such a "thought" with a message, hearts, and createdAt fields. the new tools we used was MongoDB, for storing thoughts in a database, Mongoose, for defining and interacting with the database schema. And we had to use Render for deploying the backend API. 

Initially I had problems figuring out which end points to use, my api was not returning the comments neither displaying the likes, and it turns out that it was something very simple that I didnt noticed since I made my previous frontend projects, and I it was that for some reason I added the URL in 2 different files and I forgot to change both, the other problem was that I couldnt upploaded to Render, I had to make the cluster using Atlas, and I missed the live sesion where they were talking about it, so reviewing the material and that sesion I solved it very fast!

## View it live


https://github.com/Technigo/project-happy-thoughts-api/pull/498