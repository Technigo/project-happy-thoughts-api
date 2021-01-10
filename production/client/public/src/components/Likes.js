import React, { useState } from 'react'

export const Likes = ({ id, hearts }) => {
  const like_URL = `https://happy-thoughts-technigo.herokuapp.com/thoughts/${id}/like`
  let [like, setLike] = useState(hearts)
  let [yourLike, setYourLike] = useState(0)

  const [yourLiked, setYourLiked] = useState(
    JSON.parse(localStorage.getItem(id)) + 0
  )

  localStorage.setItem(id, JSON.stringify(yourLiked))
 
  const handleLike = (event) => {
    fetch(like_URL, {
      method:'POST', 
      headers: {'Content-Type': 'application/json'},
      body: ''
    })
      .then((res) => res.json())
      .then(() => {}, [])
    setLike((staleState) => staleState + 1)
    setYourLike((staleState) => staleState + 1)
    setYourLiked((staleState) => staleState + 1)

    localStorage.setItem(id, JSON.stringify(yourLiked))
    }

  return (
    <div>
      <button 
        onClick={handleLike}
        className={like > 0 ? "has-likes" : "no-likes"}
      >
          <span 
            role="img"
            aria-label="Heart"
            className="like-span">
              {'❤️'}
          </span>
      </button>
      <div className="like-count">x {like}</div>
      <div className="your-like-count">you liked this: x {yourLiked}</div>
    </div>
  )
}