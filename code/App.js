import React from 'react'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'
import "./index.css";

export const App = () => {
  return (
    <div>
      <MessageInput />
      {/* onFormSubmit={onFormSubmit} */}
      <MessageList /> 
    </div>
  )
}
