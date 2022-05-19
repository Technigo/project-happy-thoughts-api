import React from "react";

const TimeStamp = (props) => {
  const timeStamp = () => {
    const seconds = Math.floor((new Date() - new Date(props.createdAt).getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    let unitsOfTime;

    if (interval >= 1) {
      unitsOfTime = "year";
    } else {
      interval = Math.floor(seconds / 2592000);
      if (interval >= 1) {
        unitsOfTime = "month";
      } else {
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) {
          unitsOfTime = "day";
        } else {
          interval = Math.floor(seconds / 3600);
          if (interval >= 1) {
            unitsOfTime = "hour";
          } else {
            interval = Math.floor(seconds / 60);
            if (interval >= 1) {
              unitsOfTime = "minute";
            } else {
              interval = seconds
              if (interval <= 0) {
                unitsOfTime = "just now";
              } else {
                interval = seconds
                unitsOfTime = "second";
              }
            }
          }
        }
      }
    }

    if (interval > 1) {
      unitsOfTime += "s ago";
    } else if (interval === 1) {
      unitsOfTime += " ago";
    } else if (interval <= 0) {
      return unitsOfTime;
    }
    return interval + " " + unitsOfTime;
  };

  return (
    <p className="timestamp">{timeStamp()}</p>
  );
};


export default TimeStamp;