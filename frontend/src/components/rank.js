import { getAllUsers } from "./discover.js";

export const calculateTutorRanks = async () => {
    try {
      
      const users = await getAllUsers();

      //filter out to get only tutors
      const tutors = users.filter(user => user.isPublic === true);

      tutors.forEach(tutor => {
        //using default values 0 and 1
        const rating = tutor.rating || 0;
        const sessions = tutor.completedSessions || 1; 
        tutor.rankingScore = rating * sessions;
      });

      tutors.sort((a, b) => b.rankingScore - a.rankingScore);

      return tutors;
  } catch (error) {
    console.error("error calculating tutor ranks:", error);
    throw new Error("failed to calculate tutor ranks");
  }
};