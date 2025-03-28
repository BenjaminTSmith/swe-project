import { React, useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/scheduler.css";

const localizer = momentLocalizer(moment);

const PopupCalendar = ({ onClose, tutor }) => {
  const [availability, setAvailability] = useState([]);
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

  const handleSelectSlot = (slotInfo) => {
    const { start, end } = slotInfo;

    const isValid = availability.some((avail) => {
      return start >= avail.start && end <= avail.end;
    });

    if (isValid) {
      setSelectedSlot({ start, end });
      setError("");
    } else {
      setError(
        "You can only select time slots within the tutor's availabile times (green blocks)"
      );
      setSelectedSlot(null);
    }
  };

  const handleConfirm = () => {
    if (!selectedSlot) {
      setError("Please select an available time slot first");
      return;
    }
    alert("TODO: Save new booking to student and tutor's calendars");
    onClose();
  };

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: "#4CAF50",
      border: "none",
    },
  });

  return (
    <div className="calendarOverlay" onClick={onClose}>
      <div className="calendarComponent" onClick={(e) => e.stopPropagation()}>
        <div className="calendarContainer">
          <Calendar
            className="calendar"
            localizer={localizer}
            events={availability}
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
