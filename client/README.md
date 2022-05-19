# Happy Thoughts Frontend

Built the frontend to my Happy Thoughts App in React to read happy thoughts that are posted from the backend API 
I built using Express, MongoDb and Node.js. It lists the most recent thoughts and users are able to post new 
thoughts in a form. Users are also able to like happy thoughts and see how many likes there are for each thought. 

## The problem

Before I began writting code, I sketched out the components I would need and what they should do. This
gave me a better idea of what code I would need to write and what kind of states I would need. The next step 
was to fetch the thoughts from my backend API and then display them into card components. 

Then I moved on to building a form so users could write a happy thought and submit them. As well as implemented
a like button allowing users to like happy thoughts and see how many likes there are for each message. In this 
project I also included error messages back from the API to display a user friendly message for users if the 
message trying to be submitted was empty, too long, or too short. Lastly, I focused on creating a loading state 
to show a loading spinner while waiting for the API to fetch the list of recent thoughts. 

## Demo

https://happy-thoughts-frontend.netlify.app/