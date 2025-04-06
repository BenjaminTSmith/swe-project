import { getAllUsers } from "../getAllUsers.js";

export const calculateTutorRanks = async () => {
    try {
      
      const users = await getAllUsers();

      //filter out to get only tutors

      users.forEach(user => {
        //using default values 0 and 1
        const rating = user.rating || 0;
        const sessions = user.completedSessions || 1; 
        user.rankingScore = rating * sessions;
      });

      users.sort((a, b) => b.rankingScore - a.rankingScore);

      return users;
  } catch (error) {
    console.error("error calculating tutor ranks:", error);
    throw new Error("failed to calculate tutor ranks");
  }
};