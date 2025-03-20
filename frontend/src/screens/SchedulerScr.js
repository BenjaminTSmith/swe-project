import { React, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/scheduler.css";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";

const localizer = momentLocalizer(moment);
const auth = getAuth(app);
const db = getFirestore(app);

const SchedulerScr = () => {
  const [availability, setAvailability] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week");

  const [location, setLocation] = useState("");
  const [subjects, setSubjects] = useState("");
  const [rate, setRate] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // delete event/availability when clicked on
  const handleSelectEvent = (event) => {
    setAvailability((prev) =>
      prev.filter(
        (slot) =>
          slot.start.getTime() !== event.start.getTime() ||
          slot.end.getTime() !== event.end.getTime()
      )
    );
  };

  // automatically merge overlapping availability
  const handleSelectSlot = (slotInfo) => {
    const newStart = slotInfo.start;
    const newEnd = slotInfo.end;

    const overlappingEvents = availability.filter((existing) => {
      return newStart <= existing.end && newEnd >= existing.start;
    });

    if (overlappingEvents.length > 0) {
      const mergedStart = new Date(
        Math.min(
          newStart.getTime(),
          ...overlappingEvents.map((e) => e.start.getTime())
        )
      );

      const mergedEnd = new Date(
        Math.max(
          newEnd.getTime(),
          ...overlappingEvents.map((e) => e.end.getTime())
        )
      );

      setAvailability((prev) => [
        ...prev.filter((event) => !overlappingEvents.includes(event)),
        {
          start: mergedStart,
          end: mergedEnd,
        },
      ]);
    } else {
      setAvailability((prev) => [
        ...prev,
        {
          start: slotInfo.start,
          end: slotInfo.end,
        },
      ]);
    }
  };

  const saveChanges = async () => {
    const user = auth.currentUser; // Get the currently signed-in user
  
    if (!user) {
      alert("You must be signed in to save changes.");
      return;
    }
  
    try {
      const userDocRef = doc(db, "Users", user.email); 
      const userDocSnap = await getDoc(userDocRef); 
  
      if (!userDocSnap.exists()) {
        alert("User data not found.");
        return;
      }
  
      await updateDoc(userDocRef, {
        isPublic: isPublic,
        location: location,
        subjects: subjects,
        rate: rate,
        availability: availability.map((slot) => ({
          start: slot.start.toISOString(),
          end: slot.end.toISOString(),
        })),
      });
  
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error updating Firestore:", error);
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="schedulerContainer">
      <div className="calendarContainer">
        <Calendar
          className="calendar"
          localizer={localizer}
          events={availability}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          defaultView="week"
          date={currentDate}
          view={view}
          views={["day", "week"]}
          onNavigate={setCurrentDate}
          onView={setView}
          min={
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              8,
              0
            )
          }
          max={
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              currentDate.getDate(),
              22,
              0
            )
          }
          step={15}
          timeslots={4}
          eventPropGetter={() => ({
            style: {
              backgroundColor: "#4CAF50",
              border: "none",
            },
          })}
        />
      </div>
      <div className="textFieldContainer">
        <div className="inputContainer">
          Subjects
          <input
            type="text"
            value={subjects}
            onChange={(event) => {
              setSubjects(event.target.value);
            }}
            className="schedulerTextInput"
          ></input>
        </div>
        <div className="inputContainer">
          Location
          <input
            type="text"
            value={location}
            onChange={(event) => {
              setLocation(event.target.value);
            }}
            className="schedulerTextInput"
          ></input>
        </div>
        <div className="inputContainer">
          Hourly Rate
          <input
            type="text"
            value={rate}
            onChange={(event) => {
              setRate(event.target.value);
            }}
            className="schedulerTextInput"
          ></input>
        </div>
        <div className="checkBoxContainer">
          Make Tutor Posting Public:
          <input
            type="checkbox"
            className="checkbox"
            value={isPublic}
            onChange={() => {
              setIsPublic(!isPublic);
            }}
          ></input>
        </div>

        <button className="saveButton" onClick={saveChanges}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SchedulerScr;
