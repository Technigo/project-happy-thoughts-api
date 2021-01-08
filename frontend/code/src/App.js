import React,{ useState, useEffect } from 'react';

import Header from './Component/Header';
import ThoughtSubmitForm from 'Component/ThoughtSubmitForm';
import MessageList from 'Component/MessageList';
import { API_URL } from './constants';
import './index.css';

//there are 3 erros found in the response relating to empty, too short or too long messages.
const THOUGHT_ERRORS = [
  { kind: 'required', message: 'Please type in your happy thought' },
  { kind: 'minlength', message: 'Message should be longer than 5 characters' },
  { kind: 'maxlength', message: 'Oops! Can you keep the message shorter than 140 characters, please.' }
];

export const App = () => {
  const [thought, setThought] = useState(""); //the thought state needs to be here in the App.js instead in the child component to handle the erro update while hitting submit button.
  const [thoughts, setThoughts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    fetch(API_URL)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setThoughts(data)
      });
  };

  const handleThoughtChange = (newThought) => {
    setThought(newThought);
  };

  // errorMassage will be cleared and Textarea for thought input should be cleared too.
  const clearForm = () => {
    setErrorMessage(null);
    setThought("");
  };

  const handleThoughtSubmit = (thought) => {
    const body = JSON.stringify({ message: thought });

    fetch(API_URL, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body
      })
      .then(res => res.json())
      .then((json) => {
        // Catch any errors
        if (json.errors) {
          const messageItem = THOUGHT_ERRORS.find((item) => {
            return item.kind === json.errors.message.kind;
          });
          if (messageItem) {
            throw new Error(messageItem.message);
          } else {
            //this else if is just to make sure if there are any errors that are not the same with the three identified errors
            throw new Error("Something goes wrong. Call someone to share your thought then")
          }
        }

        // When post request was successful
        clearForm();
        fetchMessages();
      })
      .catch(error => {
        setErrorMessage(error.message);
        //if there is any error, then the textArea will still keep the thought input so that users can edit.
      });
    };

    // This component is to send the Like to the API
  const handleLikeClick = (thoughtId) => {
    const url = `${API_URL}/${thoughtId}/like`;

    fetch(url, {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      });
      //Here we will not perform any response fetch because we just need to post the "Like"
  };

  return (
    <div>
      <Header />
      <div  className="main-form">
        <section>
          <ThoughtSubmitForm
            thought={thought}
            onThoughtChange={handleThoughtChange}
            onSubmitThought={handleThoughtSubmit}
            errorMessage={errorMessage}
          />
        </section>
        <section>
          <MessageList 
            thoughts={thoughts}
            onLikeClick={handleLikeClick}
          />
        </section>
      </div>
    </div>
  );
};
