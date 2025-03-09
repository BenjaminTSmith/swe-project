import {React, useState} from 'react'
import TutorCard from '../components/TutorCard'

const DiscoverScr = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  }
  return (
    <div className="discoverWrapper">
      <div className="discoverContainer">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
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
  )
}

export default DiscoverScr