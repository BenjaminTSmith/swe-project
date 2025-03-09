import React from 'react'

const TutorCard = ({tutor = {name: "John Smith", subjects: ["Computer Science","Mathematics"]}}) => {
  
  const { name, subjects } = tutor;

  const handleSession = () => {
    alert("Book Session Button Pressed");
    console.log(tutor.name);
  }

  return (
    <div className='tutorCard'>
      <div className='tutorText'>
        <div className='tutorName'>
          {name}
        </div>
        <div className='tutorDesc'>
          <b>Subjects: </b> {subjects.join(', ')}
        </div>
      </div>
        <button className='scheduleButton' onClick={handleSession}>
          <b>Schedule Session</b>
        </button>
    </div>
  )
}

export default TutorCard