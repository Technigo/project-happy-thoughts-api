export const TimeAgo = ({ timestamp }) => {
  const currentTime = new Date();
  const postedTime = new Date(timestamp);

  const timeDifference = currentTime - postedTime;
  const minutesAgo = Math.floor(timeDifference / (1000 * 60));

  if (minutesAgo === 0) {
    return "Just now";
  } else if (minutesAgo < 60) {
    return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`;
  } else if (minutesAgo < 1440) {
    const hoursAgo = Math.floor(minutesAgo / 60);
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  } else if (minutesAgo < 10080) {
    const daysAgo = Math.floor(minutesAgo / 1440);
    return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  } else if (minutesAgo < 40320) {
    const weeksAgo = Math.floor(minutesAgo / 10080);
    return `${weeksAgo} ${weeksAgo === 1 ? "week" : "weeks"} ago`;
  } else {
    const monthsAgo = Math.floor(minutesAgo / 40320);
    return `${monthsAgo} ${monthsAgo === 1 ? "month" : "months"} ago`;
  }
};
