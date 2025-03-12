import React from "react";

const TutorCard = ({
  tutor = { name: "John Smith", subjects: ["Computer Science", "Mathematics"] },
  onSelect,
}) => {
  const { name, subjects } = tutor;

  return (
    <div className="tutorCard">
      <div className="tutorText">
        <div className="tutorName">{name}</div>
        <div className="tutorDesc">
          <b>Subjects: </b> {subjects.join(", ")}
        </div>
      </div>
      <button className="scheduleButton" onClick={onSelect}>
        <b>Schedule Session</b>
      </button>
    </div>
  );
};

export default TutorCard;
