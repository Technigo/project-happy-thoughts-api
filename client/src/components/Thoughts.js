import React, { useState, useEffect } from "react";

import ThoughtForm from "./ThoughtForm";
import ThoughtCards from "./ThoughtCards";
import Spinner from "./partials/Spinner";

import { herokuUrl } from "urls";

const Thoughts = () => {
  const [username, setUsername] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({})
  const [error, setError] = useState(false);

  const fetchThoughts = () => {
    setLoading(true)
    fetch(herokuUrl)
      .then(res => res.json())
      .then(thoughts => setThoughts(thoughts.thoughts))
      .catch(error => console.error("error:", error))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchThoughts()
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    fetch(herokuUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: newThought,
        username: username === "" ? "Anonymous" : username
      })
    })
      .then(res => res.json())
      .then((newThought) => {
        if (newThought.error) {
          setErrorMessage({
            message: newThought.message,
            path: newThought.error.message.path,
            type: newThought.error.message.properties.type,
            propertiesMessage: newThought.error.message.properties.message,
          });
          setError(true);
        } else {
          fetchThoughts();
          setNewThought("");
          setUsername("");
        };
      });
  };

  const handleNewThought = (event) => {
    setNewThought(event.target.value);
    setError(false)
  };

  const handleUser = (event) => {
    setUsername(event.target.value);
    console.log(username);
  };

  const handleLikes = (id) => {
    const updatedLikes = thoughts.map((thought) => {
      if (thought._id === id) {
        thought.hearts += 1;
      }
      return thought;
    })
    setThoughts(updatedLikes);
  };

  if (loading) {
    return (
      <div className="loaderContainer">Loading happy thoughts
        <Spinner />
      </div>
    );
  };

  return (
    <main>
      <ThoughtForm
        username={username}
        handleUser={handleUser}
        handleNewThought={handleNewThought}
        newThought={newThought}
        error={error}
        errorMessage={errorMessage}
        handleFormSubmit={handleFormSubmit}
      />
      {thoughts.map(thought => (
        <article key={thought._id} className="thought-cards cards">
          <ThoughtCards
            handleLikes={handleLikes}
            id={thought._id}
            thought={thought}
            username={thought.username}
          />
        </article>
      ))}
    </main>
  );
};

export default Thoughts;