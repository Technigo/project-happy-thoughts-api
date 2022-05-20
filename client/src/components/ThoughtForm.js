import React from "react";

import HeartIcon from "./partials/HeartIcon";

const ThoughtForm = ({
  username,
  newThought,
  handleNewThought,
  handleFormSubmit,
  handleUser,
  error,
  errorMessage
}) => {

  const errorMessages = [
    `Message: ${errorMessage.message}`,
    `Error occurred at: ${errorMessage.path}`,
    `${errorMessage.type}: ${errorMessage.propertiesMessage}`
  ];

  return (
    <form onSubmit={handleFormSubmit} className="form cards">
      <label htmlFor="thoughtInput">What's making you happy right now?</label>
      <textarea
        type="text"
        id="thoughtInput"
        value={newThought}
        name="thought"
        onChange={handleNewThought}
      />
      <label htmlFor="thoughtAuthor">Author:</label>
      <input
        type="text"
        id="thoughtAuthor"
        className="author-input"
        value={username}
        onChange={handleUser}
        placeholder="Enter your name or post anonymously..."
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
  );
};

export default ThoughtForm;