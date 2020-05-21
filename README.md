# Project Happy Thoughts API

Create a database for a twitter-like message board which would allow users to post and like thoughts.

## The problem

The mongoose model for each thought was very simple to implement and display to the user using simple GET requests.
I implemented the 'like' function using findOneAndUpdate which returns a new object after it has completed its job.
I used regex to allow users to 'sign' their messages by writing a name after a '~' symbol. 

## View it live


Back-end: https://williamjensen-happythoughts.herokuapp.com/
Front-end: https://festive-heyrovsky-dd1229.netlify.app/