import React, { useState } from 'react'

export const NewPost = () => {
  const post_url = "https://happy-thoughts-technigo.herokuapp.com/thoughts"
  const [thought, setThought] = useState("")

  // Disallow empty post
  const isEmpty = value => value.replace(/\s/g, "").length === 0

  // Submit post
  const handleSubmit = event => {
    event.preventDefault()
    fetch(post_url, {
      method:'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify({ message: thought })
      })
      .then(() => {
      window.location.reload()
    })
    .catch(err => console.log("error:", err))
  }
  
  return (
    <form>
      <p className="post-prompt">
        What's making you happy right now?</p>
      <textarea
        className="form-text"
        onChange={event => setThought(event.target.value)}
        rows="4"
        columns="100"
        spellCheck="true"
        name="thought"
        required
        placeholder="Send some happy out into the ether..."
        value={thought}
      />
      {/* Counter to show characters remaining */}
      <p className={
        thought.length > 140 ? "p-red" : "p-green" }>
          { 140 - thought.length}<span className="counter">&nbsp;/ 140</span>
      </p>
      <button 
        onClick={handleSubmit}
        className="submit-button" 
        value="❤️ Send Happy Thought ❤️"
        disabled={
          thought.length < 5 ||
          thought.length > 140 ||
          isEmpty(thought)
        }>
          <span 
            role="img" 
            aria-label="Heart" 
            className="post-span">❤️</span>
          Send Happy Thought
          <span 
            role="img" 
            aria-label="Heart" 
            className="post-span">❤️</span>
        </button>
    </form>
  )
}