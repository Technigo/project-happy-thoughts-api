# Project Happy Thoughts API

A backend for the frontend project happy thoughts. It's validating the data and saves the user input to the database using POST and PATCH requests. 


GET REQUESTS
  /thoughts?page=<page number>&perPage=<numbers per page> : Give you the thoughts sorted with the latest one in the top
    /thoughts/mostliked: Sorts the list of thoughts with the one with most hearts at the top
    /thoughts/oldest: Gives you the oldest thought first

POST/PATCH REQUESTS
/thoughts : use this endpoint to update or save to the database


## The problem

Everything went smoothly, I used the lives sessions to answer the questions I had and that was enough. I'll see if i can add the pagination and infinite scroll before the deadline is up. 

## View it live

https://project-happy-thoughts-api-dsxqivtt3a-lz.a.run.app/
