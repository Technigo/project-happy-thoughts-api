import React from 'react'

import { Published } from './components/Published'
import { NewPost } from './components/NewPost'
import { Footer } from './components/Footer'

export const App = () => {
  return (
    <div className="app-container">
    <h1>Happy Thoughts Machine 
      <span 
        role="img"
        aria-label="love letter emoji"
        className="h1-span"
        tabIndex="0"
      >
       {'💌 '}
      </span>
    </h1>
      <NewPost />
      <Published />
      <Footer />
    </div>
  )
}