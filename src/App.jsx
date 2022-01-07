import React, { useState, useEffect } from "react";

import { Header, Footer } from "./components/Base";
import MessageForm from "./components/MessageForm";
import { API_URL, LIKES_URL } from "./utils/Urls";
import MessageItem from "./components/MessageItem";

export const App = () => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");

	useEffect(() => {
		fetchMessages();
	}, []);

	const fetchMessages = () => {
		fetch(API_URL)
			.then((res) => res.json())
			.then((data) => setMessages(data))
			.finally(() => setNewMessage(""));
	};

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ message: newMessage }),
	};

	const handleOnFormSubmit = (event) => {
		event.preventDefault();

		fetch(API_URL, options)
			.then((res) => res.json())
			.then((data) => {
				fetchMessages(data);
			});
	};

	const handleLikeIncrease = (messageId) => {
		fetch(LIKES_URL(messageId), options)
			.then((res) => res.json())
			.then((data) => {
				fetchMessages(data);
			});
	};

	return (
		<main>
			<Header />
			<MessageForm
				onFormSubmit={handleOnFormSubmit}
				newMessage={newMessage}
				setNewMessage={setNewMessage}
			/>
			{messages.map((messages) => (
				<MessageItem
					key={messages._id}
					message={messages}
					onLikeIncrease={handleLikeIncrease}
				/>
			))}
			<Footer />
		</main>
	);
};
