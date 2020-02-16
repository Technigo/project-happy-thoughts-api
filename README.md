# Project Happy Thoughts API

In this project I used Express and Mongodb to build an API which includes both GET request endpoints to return data and POST endpoints to create data.

## The solution

I did an API that should work in a frontend project thats called happy thoughts, which I did a few weeks before and works as twitter but only sends happy thougths. So this backend code that I built is the api that handles the user input.

In order to build the api I created mongoose model for the thoughts which has the properties "message", "heart" and  "createdAt". I used GET endpoint with the limit() method to return a maximum of 20 thoughts, and the sort() method to sort by createdAt property to show the most recent thoughts firts. To print out the thought message I used the POST endpoint to save the thought object, thats created whith the user input.

In order to like a message I used POST endpoint with a params path, to find a thoughts id and update the property heart and add one heart to the message. In order to find the id and update the heart, I used findOneAndUpdate() function. I got an deprecation warning message when I used the findOneAndUpdate() function. But I fixed it by reading on mongoosejs.com about deprecation warnings.

If I had more time I would have created tags in order to filter the thoughts into different categories.

## View it live

The backend version https://happy-thoughts-app.herokuapp.com/
Togeher with frontend https://happy-thoughts.netlify.com/
