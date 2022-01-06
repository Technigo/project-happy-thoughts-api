# Project Happy Thoughts API
For this week we had to expose endpoints to our users to allow them to POST data to our API and then use that data to save new objects in our Mongo database. 🤍 📭

## How I did it:
I started the project by adding all the code from Monday lesson to my repo. And then I added the GET /thoughts, POST /thoughts and POST thoughts/:thoughtId/like (a like click = a added heart). After all code was set I tried out the GET and POST in Postman by writing a message and everything worked out well. 

After I had deployed my site on Heroku and added it in my frontend I saw that I got and error (400) in devtools regarding the likes... and I couldn't see where in my backend or frontend I have done wrong. So I added a debugg-testing function for JavaScript to use in VS-Code and debugged my code and eventually I found the mistake, the like function had a misspell. I found the debugging tool really useful! 👩‍💻

Link to debugg-testing-tool:
https://code.visualstudio.com/docs/nodejs/nodejs-debugging

What we learned this week:
- How to use POST requests to send data to your API
- How to store data in your database from POST requests
- How to validate data and ensure your database only contains 'good' data
- How to build a full API which includes handling of user input
- How to build an API which works well with an existing frontend

## View it live
Link to my API: https://rosanna-happy-thoughts-api.herokuapp.com/

Link to updated Netlify page with my API: https://happythoughts-rosanna.netlify.app/