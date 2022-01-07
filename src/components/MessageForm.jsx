import React from "react";

const MessageForm = ({ newMessage, onFormSubmit, setNewMessage }) => {
	return (
		<form className="form-container" onSubmit={onFormSubmit}>
			<label htmlFor="message">
				<h2 className="label-text">What's making you happy right now?</h2>
			</label>
			<textarea
				className="input-container"
				type="text"
				name="newMessage"
				id="message"
				minLength="5"
				maxLength="140"
				placeholder="Write something lovely..."
				value={newMessage}
				onChange={(event) => setNewMessage(event.target.value)}
			/>
			<button
				className="send-button"
				disabled={newMessage.length < 5 || newMessage.length > 140}
				type="submit"
			>
				<span className="heart-span" role="img" aria-label="heart emoji">
					❤️
				</span>{" "}
				Send Happy Thought!{" "}
				<span className="heart-span" role="img" aria-label="heart emoji">
					❤️
				</span>
			</button>
		</form>
	);
};

export default MessageForm;
