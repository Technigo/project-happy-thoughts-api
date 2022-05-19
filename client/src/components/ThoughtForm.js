import React, { useState } from "react";

import HeartIcon from "./partials/HeartIcon";

const ThoughtForm = ({ setThoughts }) => {
  const [newThought, setNewThought] = useState("");
  const [errorMessage, setErrorMessage] = useState({})
  const [error, setError] = useState(false);

  const errorMessages = [
    `Type of error: ${errorMessage.name}`,
    `Message: ${errorMessage.message}`,
    `Error occurred at: ${errorMessage.path}`,
    `${errorMessage.type}: ${errorMessage.propertiesMessage}`
  ]

  const handleFormSubmit = (event) => {
    event.preventDefault();

    fetch("https://happy-thoughts-technigo.herokuapp.com/thoughts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newThought })
    })
      .then(res => res.json())
      .then((newThought) => {
        if (newThought.errors) {
          setErrorMessage({
            name: newThought.errors.message.name,
            message: newThought.message,
            path: newThought.errors.message.path,
            type: newThought.errors.message.properties.type,
            propertiesMessage: newThought.errors.message.properties.message,
          })
          setError(true)
          setNewThought("")
        } else {
          setThoughts((thoughts) => [newThought, ...thoughts])
        }
      })
      .catch(error => console.error(error))
      .finally(setNewThought(""))
  }

  return (
    <>
      <form onSubmit={handleFormSubmit} className="form cards">
        <label htmlFor="thoughtInput">What's making you happy right now?</label>
        <textarea
          type="text"
          id="thoughtInput"
          value={newThought}
          name="thought"
          onChange={event => {
            setNewThought(event.target.value)
            setError(false)
          }}
        />
        {error &&
          <ul className="error-message">
            {errorMessages.map(message => (
              <li>{message}</li>
            ))}
          </ul>
        }
        <div className="button-wrapper">
          <button type="submit">
            <HeartIcon />
            Send Happy Thought
            <HeartIcon />
          </button>
          <p className={
            (newThought.length < 6 || newThought.length > 140
              ? "red-message-length"
              : "message-length"
            )
          }>
            {newThought.length}/140
          </p>
        </div>
      </form>
    </>
  );
};

export default ThoughtForm;