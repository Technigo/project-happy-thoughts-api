import React, { useEffect, useState } from 'react';

import '../Style/LikeButton.css';
import '../Style/HeartIcon.css';

// This component is to update the like button on the messages. For better performance and prevent fetching the whole messageList on each Like, the likeCount will be updated in the local state rather than to the API.
const LikeButton = ({ thought, onLikeClick }) => {
  const [classNames, setClassNames] = useState([]);
  const [likeCount, setLikeCount] = useState(thought.hearts);

  //this function is to change the add the "pink-button" class when the likeCount is > 0
  
  useEffect(() => {
    setClassNames([
      "like-button",
      ...(likeCount > 0 ? ["pink-button"] : [])
    ]);
  },[likeCount]);
  
  const clickLikeButton = () => {
    setLikeCount(likeCount + 1)
    onLikeClick(thought._id)
  };

  return (
    <div className="like-button-container">
      <button 
        className={classNames.join(' ')}
        type="button"
        onClick={() => clickLikeButton()}>
        <span className="heart-icon-like" aria-label="heart emoji" role="img">&#10084;&#65039;</span>
      </button>
      <p>x {likeCount}</p>
    </div>
  );
};
 
export default LikeButton;