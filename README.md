# Project Happy Thoughts API

We had to build an API using Express and MongoDB which included both GET and POST endpoints. The API followed a given Mongoose model based on the Happy Thoughts app we had created previously. The GET endpoint needed to return 20 results, and be in descending order according to the timestamp. The POST endpoints needed to allow a user to create a ‘happy thought’, and for a happy thought to be ‘liked’. The API needed to validate user input and return appropriate error messages. 


## The problem

I started by creating the Mongoose model, and making sure that the properties kept to the special rules and validations. The ‘createdAt’ property had to be non-assignable when creating a thought. This took some time to figure out how to do; I tried to edit the schema but it didn’t work. In the end I solved it by removing this property from the ‘req.body’ object. Getting the ‘hearts’ property to work as specified also created issues, but I got it to function by turning the ‘hearts/like’ function into a PATCH request and setting hearts to 0 in the POST / thoughts request. 

## View it live

Frontend Happy Thoughts: https://fiona-klacar-project-happy-thoughts.netlify.app/
Frontend repo: https://github.com/FionaKlacar/project-happy-thoughts
Backend Happy Thoughts: https://fiona-klacar-project-happy-thoughts-api.onrender.com/