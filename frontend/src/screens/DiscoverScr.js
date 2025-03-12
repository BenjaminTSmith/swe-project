import { React, useState } from "react";
import TutorCard from "../components/TutorCard";
import PopupCalendar from "../components/PopupCalendar";
import "../css/discover.css";

const DiscoverScr = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [popup, setPopup] = useState(false);

  return (
    <div className="discoverWrapper">
      {popup && <PopupCalendar onClose={() => setPopup(false)} />}
      <div className="discoverContainer">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
          className="discoverInput"
        />
        <div className="tutorCardContainer">
          <TutorCard onSelect={() => setPopup(true)} />
          <TutorCard />
          <TutorCard />
          <TutorCard />
          <TutorCard />
          <TutorCard />
          <TutorCard />
          <TutorCard />
          <TutorCard />
        </div>
      </div>
    </div>
  );
};

export default DiscoverScr;
