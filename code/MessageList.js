import React, {useState, useEffect} from 'react'
import './MessageList.css'
import { MessageCard } from 'MessageCard'


export const MessageList = () => {

   const [messages, setMessages] = useState([]);
   
   // set state for the messages

    useEffect(() => {
        fetch('http://localhost:8080')
          .then((res) => res.json())
          .then((data) => {
            setMessages(data)
          })
      }, [])

      // using useEffect to fetch messages

      const onLiked = likedThoughtId => {
        const updatedThoughts = messages.map((thought) => {
          if (thought._id === likedThoughtId) {
            thought.hearts += 1
          }
          return thought
        })
        setMessages(updatedThoughts)
      }


      return (
        <section className="messages">
          {messages.map((message) => {
            return (
              <MessageCard 
              key={message._id} id={message._id} hearts={message.hearts} message={message.message} time={message.createdAt} onLiked={onLiked}
              />
            //   Prints out one Message Card component per each message in the array of thooughts
            )
          })}
        </section>
      )
};

