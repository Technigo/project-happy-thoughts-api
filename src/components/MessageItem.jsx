import React from "react";
import moment from "moment";

const MessageItem = ({ message, onLikeIncrease }) => {
	return (
		<div className="message-container">
			<p className="message">{message.message}</p>
			<div className="likes-and-submitted">
				<div className="likes-container">
					<button
						className={message.hearts === 0 ? "like-button" : "liked-button"}
						onClick={() => onLikeIncrease(message._id)}
					>
						<span className="heart-span" role="img" aria-label="heart emoji">
							❤️
						</span>
					</button>
					<p> x {message.hearts}</p>
				</div>
				<div className="submitted-container">
					<p>{moment(message.createdAt).fromNow()}</p>
				</div>
			</div>
		</div>
	);
};

export default MessageItem;
