import React from "react";

import HeartIcon from "./partials/HeartIcon";
import TimeStamp from "./partials/TimeStamp";

import { herokuUrl } from "urls";

const ThoughtCards = ({ thought, handleLikes, id, username }) => {

  const handleLikesClick = () => {
    fetch(`${herokuUrl}/${id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    }).then(() => handleLikes(id))
  }

  return (
    <>
      <p className="thought-messages">{thought.message}</p>
      {username !== "anonymous" && <p>- {username}</p>}
      <div className="button-wrapper">
        <div>
          <button
            onClick={handleLikesClick}
            className={(thought.hearts === 0 ? "heart-button" : "heart-button red-heart-button")}>
            <HeartIcon classname={"heart-icon"} />
          </button>
          {thought.hearts > 0 && <p className="likes">x {thought.hearts}</p>}
        </div>
        <TimeStamp createdAt={thought.createdAt} />
      </div>
    </>
  );
};

export default ThoughtCards;