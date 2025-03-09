import { React, useState } from "react";
import TutorCard from "../components/TutorCard";
import "../css/discover.css";

const DiscoverScr = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="discoverWrapper">
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
          <TutorCard />
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
