import { collection, getDocs, getFirestore} from "firebase/firestore";
import { app } from './firebaseConfig.js';

const db = getFirestore(app);


export const getAllUsers = async () => {
    try {
        const userRef = collection(db, "Users");
        const userSnap = await getDocs(userRef);

        const userList = userSnap.docs.map(doc => {
            const userData = doc.data();
            const { password, ...everything_else } = userData;
            console.log(everything_else);
            return everything_else;
        });
        
        return userList;
    }
    catch (e) {
        console.error("error getting users: ", e);
        throw new Error ("error getting users");
    }
};

