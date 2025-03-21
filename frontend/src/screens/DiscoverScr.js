import { React, useState, useEffect } from "react";
import TutorCard from "../components/TutorCard";
import PopupCalendar from "../components/PopupCalendar";
import "../css/discover.css";
import { getAllUsers } from "../components/discover";

const DiscoverScr = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [popup, setPopup] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const users = await getAllUsers();
      setAllUsers(users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="discoverWrapper">
      {popup && (
        <PopupCalendar tutor={selectedTutor} onClose={() => setPopup(false)} />
      )}
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
          {loading ? (
            <p>Loading tutors...</p>
          ) : (
            allUsers
              .filter(
                (user) =>
                  user.isPublic &&
                  user.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((user) => (
                <TutorCard
                  tutor={user}
                  onSelect={() => {
                    setPopup(true);
                    setSelectedTutor(user);
                  }}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverScr;
