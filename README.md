# Project Happy Thoughts API
Created my own API for my Happy Thoughts project.
Users can post, like and sort thoughts.

## The problem
To replace the Happy Thoughts API with my own version, I had to recreate the model used in the original API.

I checked what keys and values I should use and built my new Thought model. The database should only save messages that are between 5 and 140 characters long. A user should not be able to add likes when posting the message. The date should automatically be the date and time when the user posts the message. 

When the model was done, I recreated the endpoints for getting and posting messages as well as liking a posted message. I also added the ability to sort posted thoughts by new, old and popular.

Some things I probably want to add later is: pagination and categories.

## Tech
* Express
* MongoDB
* Mongoose

## View it live

[Happy thoughts](https://happy-thoughts-emmie.herokuapp.com/)

[Happy Thoughts API]()
### See 20 posted thoughts
`GET: https://happy-thoughts-emmie.herokuapp.com/`

`GET: https://happy-thoughts-emmie.herokuapp.com/?sort=new`

`GET: https://happy-thoughts-emmie.herokuapp.com/?sort=old`

`GET: https://happy-thoughts-emmie.herokuapp.com/?sort=popular`
### Posting a thought
`POST: https://happy-thoughts-emmie.herokuapp.com/`

### Liking a post 
`POST: https://happy-thoughts-emmie.herokuapp.com/{id}/like`
