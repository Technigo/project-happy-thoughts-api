import React, { useState, useEffect } from 'react'
import moment from 'moment'

import { Likes } from './Likes'


export const Published = () => {
  const posted_url = "https://happy-thoughts-technigo.herokuapp.com/thoughts"
  const [pubPosts, setPubPosts] = useState([])

  useEffect(() => {
    fetch(posted_url)
      .then(response => {
        return response.json()
      })
      .then(data => {
        setPubPosts(data)
      })
  }, [])
  
  return (
    <section>
      {pubPosts.map(pubPost => (
        <article 
          key={pubPost._id} 
          className="pubPost">
            <p className="post-txt">
              {pubPost.message}
            </p>
            <div className="post-info"> 
              <span className="post-time">
                {moment(pubPost.createdAt).fromNow()}
              </span>
              <Likes 
                id={pubPost._id}
                hearts={pubPost.hearts}
                />
            </div>
      </article>
      ))
      }
    </section>
  )
}