import { useState, useEffect } from "react"

export const App = () => {
  const [thoughts, setThoughts] = useState([])
  const [newThought, setNewThought] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [error, setError] = useState("")
  const [likedThoughtIds, setLikedThoughtIds] = useState([])
  const [uniqueLikedCount, setUniqueLikedCount] = useState(0)
  const [showLikedThoughts, setShowLikedThoughts] = useState(false)
  const [isAddingThought, setIsAddingThought] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch("https://project-happy-thoughts-api1.onrender.com/thoughts")
      .then((response) => response.json())
      .then((data) => {
        setThoughts(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching thoughts", error)
        setIsLoading(false)
      })
  }, [])

  const handleFormSubmit = (event) => {
    event.preventDefault()

    if (newThought.length < 5 || newThought.length > 140) {
      setError("Thought must be between 5 and 140 characters long.")
      return
    }

    setIsAddingThought(true)

    fetch("https://project-happy-thoughts-api1.onrender.com/thoughts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: newThought }),
    })
      .then((response) => response.json())
      .then((newThought) => {
        setThoughts([newThought, ...thoughts])
        setNewThought("")
        setError("")
        setIsAddingThought(false)
      })
      .catch((error) => {
        console.error("Error posting thought", error)
        setIsAddingThought(false)
      })
  }

  const likeThought = (thoughtId) => {
    fetch(
      `https://project-happy-thoughts-api1.onrender.com/thoughts/${thoughtId}/like`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then((updatedThought) => {
        setThoughts(
          thoughts.map((thought) =>
            thought._id === updatedThought._id ? updatedThought : thought
          )
        )
        setLikedThoughtIds([...likedThoughtIds, updatedThought._id])
        setUniqueLikedCount((prevCount) => prevCount + 1)
      })
      .catch((error) => console.error("Error liking thought", error))
  }

  const handleLikedThoughtsClick = () => {
    setShowLikedThoughts(!showLikedThoughts)
  }

  function timeAgo(dateString) {
    const now = new Date()
    const then = new Date(dateString)
    const diffInMilliseconds = now - then

    const seconds = Math.floor(diffInMilliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else {
      return `just now`
    }
  }

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1 className="title">Happy Thoughts</h1>
          <div className="like-button-container">
            <button
              onClick={handleLikedThoughtsClick}
              className="show-liked-button"
            >
              ❤️{" "}
              <span
                style={{
                  fontFamily: "'Fira Mono', monospace",
                  fontWeight: "500",
                }}
              >
                {showLikedThoughts
                  ? "Hide Liked Thoughts"
                  : "Show Liked Thoughts"}
              </span>{" "}
              ❤️️
            </button>

            <p>Total unique liked thoughts: {uniqueLikedCount}</p>
            {showLikedThoughts && (
              <ul>
                {thoughts
                  .filter((thought) => likedThoughtIds.includes(thought._id))
                  .map((likedThought, index) => (
                    <li key={index} className="liked-thought">
                      {likedThought.message}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <form onSubmit={handleFormSubmit}>
            <label htmlFor="newThoughtInput" className="text-label">
              What&apos;s making you happy right now?
            </label>
            <input
              type="text"
              id="newThoughtInput"
              name="newThought"
              value={newThought}
              onChange={(e) => {
                const inputValue = e.target.value
                setNewThought(inputValue)
                setCharCount(inputValue.length)
                setError("")
              }}
              placeholder="..."
              className="input-field"
            />
            <p
              className={charCount > 140 ? "char-count exceeded" : "char-count"}
            >
              {charCount}/140 characters
            </p>

            {error && <p style={{ color: "#FFADAD" }}>{error}</p>}
            <button type="submit" className="submit-button">
              ❤️{" "}
              <span
                style={{
                  fontFamily: "'Fira Mono', monospace",
                  fontWeight: "500",
                }}
              >
                Send Happy Thought
              </span>{" "}
              ❤️️
            </button>
          </form>
          <ul>
            {thoughts.map((thought, index) => (
              <li
                key={index}
                className={`thought-item ${isAddingThought ? "adding" : ""}`}
              >
                <div className="thought-content">
                  <span className="message">{thought.message}</span>
                </div>
                <div className="thought-actions">
                  <div className="left-actions">
                    <button
                      className={`like-button ${
                        likedThoughtIds.includes(thought._id) && "liked"
                      }`}
                      onClick={() => likeThought(thought._id)}
                    >
                      ❤️️
                    </button>
                    <span>x {thought.hearts}</span>
                  </div>
                  <div className="right-actions">
                    <span>{timeAgo(thought.createdAt)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
