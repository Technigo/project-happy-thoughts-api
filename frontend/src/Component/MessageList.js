import React from 'react';
import moment from 'moment';

import LikeButton from './LikeButton';
import '../Style/MessageList.css';
import '../Style/Container.css'

//this component is to print out all messages
const MessageList = ({ thoughts, onLikeClick }) => {
  return (
    <div>
      {thoughts.map((thought) => {
        return (
          <div className="message-box container" key={thought.createdAt}>
            <p className="message">
              {thought.message}
            </p>
            <div className="message-second-row">
              <LikeButton
                onLikeClick={onLikeClick}
                thought={thought}
              />
              <span className="second-row-elements">
                {moment(thought.createdAt).fromNow()}
              </span>
            </div>
          </div>
         );
      })};
    </div>
   );
};
 
export default MessageList;