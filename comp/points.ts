import { doc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "../comp/firebase";

export const updateUserPoints = async (pointsToAdd: number) => {
    try {
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                points: increment(pointsToAdd),  // Increment points
            });
            console.log(`Added ${pointsToAdd} points`);
        }
    } catch (error) {
        console.error("Error updating points:", error);
    }
};
