import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import { API_URL } from "../../reusable/urls";
import thoughts from "../../reducers/thoughts";

import {
  MainWrapper,
  Form,
  FormLabel,
  FormInput,
  ButtonContainer,
  SendButton,
  LimitedCharacters,
  Time,
  MessageListItemContainer,
} from "./style";

const Thoughts = () => {
  const [newThought, setNewThought] = useState("");
  const thoughtsItems = useSelector((store) => store.thoughts.items);

  const dispatch = useDispatch();

  useEffect(() => {
    const options = {
      method: "GET",
    };
    fetch(API_URL("thoughts"), options)
      .then((res) => res.json())
      .then((data) => dispatch(thoughts.actions.setThoughts(data)));
  }, [dispatch]);

  const addThought = (e) => {
    e.preventDefault();

    if (newThought) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: newThought }),
      };
      fetch(API_URL("thoughts"), options)
        .then((res) => res.json())
        .then((data) =>
          dispatch(thoughts.actions.setThoughts([...thoughtsItems, data]))
        )
        .then(setNewThought(""));
    }
  };

  return (
    <MainWrapper>
      <Form onSubmit={addThought}>
        <FormLabel htmlFor="newMessage">
          What's making you happy right now?
        </FormLabel>

        <FormInput
          type="text"
          placeholder="write your note"
          value={newThought}
          onChange={(e) => setNewThought(e.target.value)}
        />
        <ButtonContainer>
          <SendButton
            type="submit"
            length={newThought.length}
            disabled={newThought.length < 6 || newThought.length > 140}
          >
            <span role="img" aria-label="heart">
              ❤️
            </span>
            Send message!
            <span role="img" aria-label="heart">
              ❤️
            </span>
          </SendButton>
          <LimitedCharacters length={newThought.length}>
            {newThought.length} / 140
          </LimitedCharacters>
        </ButtonContainer>
      </Form>

      {thoughtsItems.map((thought) => (
        <MessageListItemContainer className="notes" key={thoughts._id}>
          {thought.message}
          <Time>{moment(thought.message.createdAt).fromNow()}</Time>
        </MessageListItemContainer>
      ))}
    </MainWrapper>
  );
};

export default Thoughts;
