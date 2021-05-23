# Happy Thoughts API

With this project I created my own backend to the frontend project "Happy Thoughts" that I built in week 11 of the Technigo Bootcamp.

## The project

The project contains endpoints to get the last 20 posted thoughts, get thoughts by username or hashtag/category using path params, deleting a thought, editing a thought, posting likes to an existing thought and posting a new thought.

When posting a new thought the user can give their name and a hashtag. The posibillity that a user might include an actual hashtag before their hashtag, like this "#football", crossed my mind. I don't want to store an hashtag character in my database so I'm checking if the first character in the string is one and if it is I remove it before saving. In the frontend the hashtags are shown with a hashtag character. There's also a posibillity that the user might try to send multiple hashtags, like this "football, bruise", as the code is setup now this will all be concidered as one string. I want to implment functionality to check if there are multiple words and in that case make the hashtags to an array.

The delete, patch and put requests are not yet implemented in the frontend, this is WIP. Also I will decide on one of put and patch and remove the other, since they are basically setup the same at this point.

When requesting thoughts by either a specific user or hashtag it is still case sensitive. The goal is to make this case insensitive and it is WIP. It is just a matter of how I want to do it, if I decide to put the username and hashtag to lower case before saving it in the database then the data can't be presented in its original case form in the frontend.

## Documentation
### Endpoints

- ```GET /thoughts```
Returns the last 20 posted thoughts

- ```GET /thoughts/category/lifestyle```
Returns all thoughts taged with lifestyle
- ```GET /thoughts/user/Sandra```
Returns all thoughts posted by Sandra

- ```POST /thoughts```
Posts a new thought
- ```POST /thoughts/60a960f77c2917002828615c/likes```
Posts a like to an existing thought

- ```DELETE /thoughts/60a960f77c2917002828615c```
Deletes a thought
- ```PATCH /thoughts/60a960f77c2917002828615c```
Updates a thought
- ```PUT /thoughts/60a960f77c2917002828615c```
Updates a thought


## View it live

Link to the project deployed at Heroku https://sandra-project-happy-thoughts.herokuapp.com/
