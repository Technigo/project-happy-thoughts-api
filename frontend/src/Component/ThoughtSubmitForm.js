import React, { useState, useEffect } from 'react';

import '../Style/ThoughtSubmitForm.css';
import '../Style/Container.css';
import '../Style/HeartIcon.css';

//This component is for message input. The useState is set to this local component only
const ThoughtSubmitForm = ({ thought, onThoughtChange, onSubmitThought, errorMessage }) => {
  const [wordCountClasses, setWordCountClasses] = useState([]);

  useEffect(() => {
    setWordCountClasses([
      "word-count",
      ...(thought.length > 140 ? ["count-turn-red"] : [])
    ]);
  },[thought]);

  return (
    <form 
      id="thought-form" 
      className="container"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="thought-form-label" htmlFor="thoughtBox">
        What's making you happy right now?
      </label>
      
      <textarea className="thought-box"
        id="thoughtBox"
        onChange={(event) => onThoughtChange(event.target.value)}
        value={thought}
      />
      <div className="error-display">
        {errorMessage && 
        <p 
          className="error-message">
          <span className="cross-sign" aria-label="crossSign" role="img">	&#10060;</span>
          {errorMessage}
        </p>}
        <p className={wordCountClasses.join(" ")}>{thought.length}/140</p>
      </div>
      <button
        className="button-submit-thought"
        disabled={false}
        form="thought-form"
        onClick={() => onSubmitThought(thought)}
        type="submit"
      >
        <span className="heart-icon" aria-label="heart emoji" role="img">&#10084;&#65039;</span>
          Send Happy Thought
        <span className="heart-icon" aria-label="heart emoji" role="img">&#10084;&#65039;</span>
      </button>
    </form>
    );
};
 
export default ThoughtSubmitForm;