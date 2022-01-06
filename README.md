# Project Happy Thoughts API

This API is used to collect happy thoughts than then is displayed on a frontend.

## The problem

The API is build with Mongo DB and Mongoose to display different kinds of data. You can post, get and delete thoguhts. The thoughts have a schema where the values have validation to them to keep the database clean. You can send a message with a tag which is required as the frontend displays diffrent colors and emojis depending on the tag. The name is not required and if no name is put in you are anonymous in the frontend.

The endpoins are:
 get /thoughts All thoughts(descending order from creation date and the 20 recent)
 post /thoughts to post a new thought to the API
 post /thought/:id/like to like a thought with that id
 delete /thought/:id To delete a specific thought with that id
## View it live

https://my-happy-thoughts.herokuapp.com
