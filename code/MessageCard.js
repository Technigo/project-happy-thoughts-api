import React from 'react'
import moment from 'moment'
import "./index.css"

export const MessageCard = props => {
    const {id, hearts, time} = props
    // destructures the data into props object
    
    const likeClick = () => {
      fetch(`http://localhost:8080/thoughts/${id}/like`, {
        method: "POST",
        body: "",
        headers: { "Content-Type": "application/json" }
      }).then(() => props.onLiked(id))
    }
    // function that adds likes/hearts to the individual post based on id using post-method
    
    return (
        <section className="card">
                <h4 key={props._id}>{props.message}</h4>
                <div className="card-details">
                    <span className={hearts > 10 ? "lots" : hearts > 5 ? "few" : "none" } onClick={likeClick}>
                    {/* Conditional operators for setting different classes depending on number of likes */}
                    <img className="heart" alt="heart-icon" src="https://img.icons8.com/cotton/64/000000/like--v1.png"/>
                    </span>
                    <p className="like-p">x {hearts}</p>
                    <p className="time">{moment(time).fromNow()}</p>
                    {/* Calculation with moment for setting the time that has passed since publication */}
                </div>
        </section>
  )
}
