# Project Happy Thoughts API

I created my own API with posts, get and patch to use with my Happy Thoughts frontend project. 

## The problem

I did not have any particular problems this week. It went pretty smoothly. It was fun creating my own API for the Happy Thoughts project!
I added sort and page queries. The default sort/order is descending but now you can also sort by oldest and most liked. The limit per page is set to 20 but with the page query you can still retrieve all messages. I also added a new property in the Thought model so you can add your name when posting a message (if none it's set to Anonymous).

With these updates, I wanted to use them in my frontend as well. So I added an input for the name, buttons so you can sort your messages and a pagination (limit is set to 20 but now you can click through pages and see all messages).

If I would have had more time I would have added categories/tags for the messages.

Endpoints:
* /thoughts - GET and POST methods for sending and retrieving messages. Available queries are sort and page. You can sort the messages on most liked, newest and oldest.
* /thoughts/:id/like - POST method to like a message.
* /thoughts/:id - PATCH and DELETE to update or delete message.

## View it live

BACKEND: https://jessikas-happy-thoughts.herokuapp.com
FRONTEND: https://jessikas-happy-thoughts.netlify.app/
FRONTEND REPO: https://github.com/jessika-hage/project-happy-thoughts
