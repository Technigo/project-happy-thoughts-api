# Project Happy Thoughts API

This is an API that works with the Happy Thoughts Project on https://boisterous-brioche-b12b23.netlify.app/. It uses MongoDB to store posted thoughts and likes. A get-request will have a response with the 20 latest thoughts.

## The problem

Working with this project was pretty straight forward with the help of class material, live sessions and previous knowledge. However when I connected it to the frontend project the thought list didn't update as expected when posting a new thought, which was frustrating. Then I did the last touches on my error handling and realised that the response was coming back in a different way from the original project. So I had to change one more line of code in the frontend to update the list with the correct part of the response. And that did the trick!

BTW it was fun to work with post-requests. Now I finally understand why Postman is such a good tool 🙂

I also did my own stretch-goal and added a dislike-path. It works well with my frontend that likes the thought the first time you click the heart, then takes it back the second time you click, then likes it again, then takes it back and so forth.

## View it live

https://tejpex-happy-thoughts-api.onrender.com/