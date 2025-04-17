import { React, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/scheduler.css";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig"; // adjust if needed
const localizer = momentLocalizer(moment);

const PopupCalendar = ({ onClose, tutor, student }) => {
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tutor?.availability) {
      const convertedAvailability = tutor.availability.map((slot) => ({
        start: new Date(slot.start),
        end: new Date(slot.end),
        title: "Available",
      }));
      setAvailability(convertedAvailability);
    }
  }, [tutor]);

  const adjustAvailability = (availabilityList, bookedSlot) => {
    const result = [];

    availabilityList.forEach((avail) => {
      const { start, end } = avail;
      const bookedStart = bookedSlot.start;
      const bookedEnd = bookedSlot.end;

      if (bookedEnd <= start || bookedStart >= end) {
        result.push(avail);
        return;
      }

      if (bookedStart > start) {
        result.push({ start: start, end: bookedStart, title: "Available" });
      }

      if (bookedEnd < end) {
        result.push({ start: bookedEnd, end: end, title: "Available" });
      }
    });

    return result;
  };

  const handleSelectSlot = (slotInfo) => {
    const { start, end } = slotInfo;

    const isValid = availability.some(
      (avail) => start >= avail.start && end <= avail.end
    );

    if (isValid) {
      setSelectedSlot({ start, end });
      setError("");
    } else {
      setError(
        "You can only select time slots within the tutor's available times (green blocks)"
      );
      setSelectedSlot(null);
    }
  };

  const handleConfirm = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (!currentUser || !currentUser.email) {
      setError("You must be logged in to book a session.");
      return;
    }
  
    if (!selectedSlot) {
      setError("Please select an available time slot first");
      return;
    }
  
    if (!tutor || !tutor.email) {
      setError("Tutor information is missing.");
      return;
    }
  
    const bookingSlot = {
      start: selectedSlot.start.toISOString(),
      end: selectedSlot.end.toISOString(),
      tutorEmail: tutor.email,
      studentEmail: currentUser.email,
    };
  
    const newAvailability = adjustAvailability(availability, selectedSlot);
    setAvailability(newAvailability);
    setBookings((prev) => [
      ...prev,
      {
        start: new Date(bookingSlot.start),
        end: new Date(bookingSlot.end),
        title: "Busy"
      }
    ]);
      
    try {
      const tutorRef = doc(db, "Users", tutor.email);
      await updateDoc(tutorRef, {
        availability: newAvailability.map((slot) => ({
          start: slot.start.toISOString(),
          end: slot.end.toISOString(),
          title: "Available"
        })),
        scheduledTimeToMeet: arrayUnion(bookingSlot),
      });
  
      const studentRef = doc(db, "Users", currentUser.email);
      await updateDoc(studentRef, {
        scheduledTimeToMeet: arrayUnion(bookingSlot),
      });
  
  
      setSelectedSlot(null);
      onClose();
    } catch (error) {
      setError("Something went wrong while saving your booking.");
    }
  }



  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: event.title === "Available" ? "#4CAF50" : "#1976D2",
      color: "#fff",
      border: "none",
    },
  });

  return (
    <div className="calendarOverlay" onMouseDown={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="calendarComponent" onClick={(e) => e.stopPropagation()}>
        <div className="calendarContainer">
          <Calendar
            className="calendar"
            localizer={localizer}
            events={[...availability, ...bookings]}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            defaultView="week"
            date={currentDate}
            view={view}
            views={["day", "week"]}
            onNavigate={setCurrentDate}
            onView={setView}
            step={15}
            timeslots={4}
            eventPropGetter={eventPropGetter}
            min={new Date(currentDate.setHours(8, 0))}
            max={new Date(currentDate.setHours(22, 0))}
          />
        </div>
        {error && <div className="discoverErrorText">{error}</div>}
        {selectedSlot && (
          <div className="selected-slot">
            Selected:{" "}
            {moment(selectedSlot.start).format("dddd, MMMM Do YYYY, h:mm a")} -{" "}
            {moment(selectedSlot.end).format("h:mm a")} (
            {moment
              .duration(moment(selectedSlot.end).diff(selectedSlot.start))
              .asHours()
              .toFixed(2)}{" "}
            hours )
          </div>
        )}
        <button
          className="scheduleButton"
          style={{ marginTop: "1vh" }}
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default PopupCalendar;