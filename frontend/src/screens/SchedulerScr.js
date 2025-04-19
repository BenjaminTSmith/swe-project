import { React, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/scheduler.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { setLogLevel } from "firebase/app";

const localizer = momentLocalizer(moment);
const auth = getAuth(app);
const db = getFirestore(app);



const SchedulerScr = () => {
  const [user, setUser] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week");
  const [location, setLocation] = useState("");
  const [subjects, setSubjects] = useState("");
  const [rate, setRate] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Save the user in state

        const userDocRef = doc(db, "Users", currentUser.email);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setLocation(data.location || "");
          setSubjects(data.subjects || "");
          setRate(data.rate || "");
          setIsPublic(data.isPublic || false);
          setAvailability(
            (data.availability || []).map((slot) => ({
              title: "",
              start: new Date(slot.start),
              end: new Date(slot.end),
            }))
          );
          setSessions(
            (data.scheduledTimeToMeet || []).map((slot) => ({
              title: `Session with ${slot.studentEmail}`,
              start: new Date(slot.start),
              end: new Date(slot.end),
            }))
          )
        }
      } else {
        setUser(null); // No user logged in
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  useEffect(() => {
    const combined = [
      ...availability.map((event) => ({ ...event, type: "availability" })),
      ...sessions.map((event) => ({ ...event, type: "session" })),
    ];
    console.log(sessions);
    setAllEvents(combined);
  }, [availability, sessions]);

  // delete event/availability when clicked on
  const handleSelectEvent = (event) => {
    if (event.type === "session") return;
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

    const conflictWithSession = sessions.some(
      (session) =>
        newStart < session.end && newEnd > session.start // overlap
    );
  
    if (conflictWithSession) return;

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
          title: "",
          start: mergedStart,
          end: mergedEnd,
        },
      ]);
    } else {
      setAvailability((prev) => [
        ...prev,
        {
          title: "",
          start: slotInfo.start,
          end: slotInfo.end,
        },
      ]);
    }
  };

  const saveChanges = async () => {
    if (!user) {
      alert("You must be signed in to save changes.");
      return;
    }

    try {
      const userDocRef = doc(db, "Users", user.email);
      await updateDoc(userDocRef, {
        isPublic: isPublic,
        location: location,
        subjects: subjects,
        rate: rate,
        availability: availability.map((slot) => ({
          title: slot.title,
          start: slot.start.toISOString(),
          end: slot.end.toISOString(),
        })),
      });

      alert("Changes saved successfully!");
    } catch (error) {
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="schedulerContainer">
      <div className="calendarContainer">
        <Calendar
          className="calendar"
          localizer={localizer}
          events={allEvents}
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
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.type === "session" ? "#2196F3" : "#4CAF50",
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
              <div className="rateWrapper">
                <span className="dollarSign">$</span>
                <input
                  type="number"
                  value={rate}
                  min="0"
                  step="0.01"
                  onChange={(event) => {
                    const value = event.target.value;
                    const valid = /^\d*\.?\d{0,2}$/.test(value); 
                    if (valid || value === "") {
                      setRate(value);
                    }
                  }}
                  className="schedulerTextInput smallInput"
                />
              </div>
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
