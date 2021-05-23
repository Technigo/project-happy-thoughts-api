Endpoints:

GET /thoughts
Gets the 20 most recent thoughts, start of array being the newest ones.

POST /thoughts
Posts a new thought. Min 4 characters, max 140. Words can't be longer than 30 characters.

DELETE /thoughts/:id
Deletes a thought with the _id provided as the slug.

PUT /thoughts/:id
Edits the message (only!) a thought with the _id provided as the slug.

POST /thoughts/:id/likes
The thought with the _id provided as the slug gets its likes/hearts increased by 1. Method is POST instead of PUT or PATCH because of the characteristics of the previously developed frontend.