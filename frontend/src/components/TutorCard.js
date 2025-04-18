import React from "react";

const TutorCard = ({ tutor, onSelect, onNameClick }) => {
  const { name, subjects, rate, location, rating } = tutor;

  return (
    <div className="tutorCard">
      <div className="tutorText">
        <div className="tutorName" onClick={onNameClick}>{name}</div>
        <div className="tutorDesc">
          <div>
            <b>Subjects: </b> {subjects}
          </div>
          <div>
            <b>Hourly Rate: </b> ${parseFloat(rate).toFixed(2)}
          </div>
          <div>
            <b>Location: </b> {location}
          </div>
          <div>
            <b>Rating: </b> {rating ? rating.toFixed(2) : "N/A"}
          </div>
        </div>
      </div>
      <button className="scheduleButton" onClick={onSelect}>
        <b>Schedule Session</b>
      </button>
    </div>
  );
};

export default TutorCard;
