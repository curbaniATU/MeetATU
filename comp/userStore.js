import { create } from "zustand";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const useUserStore = create((set) => ({
    currentUser: null,

    fetchUserInfo: async (uid) => {
        if(!uid) return set({currentUser: null});

        try{
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                set({currentUser: docSnap.data()});
            } else{
                set({currentUser: null});
            }

        } catch(error ){
            console.log("Error Fetching User Details:", error);
            return set({currentUser: null});
        }
    },

    //This is where it adds points on user actions 
    addPoints: async (uid, action) => {
        if (!uid) return;

        // Define point system
        const pointsMap = {
            message_classmate: 5,
            message_5_people: 20,
            make_study_chat: 10,
            attend_study_group: 20,
            join_study_event: 15,
            group_chat_message: 5,
            reply_message: 3,
            create_profile: 20,
            send_friend_request: 5,
            accept_friend_request: 5,
            daily_login: 5,
            leaderboard_climb: 20,
            fill_out_profile: 5,
        };

        const points = pointsMap[action] || 0;

        if (points === 0) return; // Prevent updating if no valid action

        try {
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, { points: increment(points) });
            console.log(`✅ Added ${points} points for action: ${action}`);

            // Update local state
            set((state) => ({
                currentUser: state.currentUser
                    ? { ...state.currentUser, points: (state.currentUser.points || 0) + points }
                    : null,
            }));
        } catch (error) {
            console.error("❌ Error updating points: ", error);
        }
    },
}))