import React, { useState } from 'react'
import "./index.css"
import "./MessageInput.css"


const messageUrl = "http://localhost:8080/thoughts";

export const MessageInput = props => {

    const [message, setMessage] = useState("")

    const handleSubmit = event => {
        event.preventDefault()
        fetch(messageUrl, {
            method: "POST",
            body: JSON.stringify({message}),
            headers: {"Content-Type": "application/json" }
            }
        )
        .then(() => {
        window.location.reload()
        props.onFormSubmit(message)
        })
        
        .catch(error => console.log("error:", error))
    }


    return (
        <div>
            <form className="message-form" onSubmit={handleSubmit}>
                <h3>What's making you happy right now?</h3>
                <textarea
                rows='2'
                onChange={event => setMessage(event.target.value)}
                value={message}
                ></textarea>
                <button 
                    className="submit-button"
                    type="submit"
                    value="Submit"
                    disabled= {message.length < 6 || message.length > 140 ? true : false}
                    >Send Happy Thought
                </button>
                <p>{message.length}/140</p>
            </form>
        </div>
    )

}