import { React, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/scheduler.css";

const localizer = momentLocalizer(moment);

const SchedulerScr = () => {
  const [availability, setAvailability] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("week");

  const handleSelectEvent = (event) => {
    setAvailability((prev) =>
      prev.filter(
        (slot) =>
          slot.start.getTime() !== event.start.getTime() ||
          slot.end.getTime() !== event.end.getTime()
      )
    );
  };

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

  return (
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
        views={["day", "week", "agenda"]}
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
  );
};

export default SchedulerScr;
