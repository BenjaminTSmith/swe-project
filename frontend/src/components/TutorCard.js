import React from "react";

const TutorCard = ({ tutor, onSelect }) => {
  const { name, subjects, rate, location } = tutor;

  return (
    <div className="tutorCard">
      <div className="tutorText">
        <div className="tutorName">{name}</div>
        <div className="tutorDesc">
          <div>
            <b>Subjects: </b> {subjects}
          </div>
          <div>
            <b>Hourly Rate: </b> {rate}
          </div>
          <div>
            <b>Location: </b> {location}
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
