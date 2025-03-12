import { React, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/scheduler.css";
const localizer = momentLocalizer(moment);

const PopupCalendar = ({ onClose, tutor }) => {
  const [availability, setAvailability] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week");

  const handleConfirm = () => {
    alert("TODO: Save the new booking to tutor and student calendars");
    onClose();
  };

  // automatically merge overlapping availability
  const handleSelectSlot = (slotInfo) => {
    const newStart = slotInfo.start;
    const newEnd = slotInfo.end;

    const overlappingEvents = availability.filter((existing) => {
      return newStart <= existing.end && newEnd >= existing.start;
    });

    if (overlappingEvents.length > 0) {
      return;
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
