import React, { useEffect, useState} from "react";
import { useRouter } from "expo-router";

import { auth, db } from "../config/firebase"
import { getDoc, doc} from "firebase/firestore"
import { View, Text, Button } from "react-native";

export default function Profile() {
    const [userDetails, setUserDetails] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserDetails(docSnap.data());
                    }
                    else {
                        console.log("No User Data exists")
                    }
                }
            }
            catch (error) {
                console.log(error)
            }
        };
        fetchUserDetails();
    }, []);

    async function handleLogout() {
        try{
            await auth.signOut();
            router.push("/login")
            console.log("Sign Out Successful")
        }
        catch (error)
        {
            console.log(error)
        }
    }

    return(
        <View style={{ padding: 20 }}>
            {userDetails ? (
                <View>
                    <Text style={{ fontSize: 24 }}>Profile Details</Text>
                    <Text>First Name: {userDetails.firstName}</Text>
                    <Text>Last Name: {userDetails.lastName}</Text>
                    <Text>Username: {userDetails.username}</Text>
                    <Text>Bio: {userDetails.bio}</Text>
                    <Text>Major: {userDetails.major}</Text>
                    <Text>Classification: {userDetails.classification}</Text>
                    <Button title="Logout" onPress={handleLogout} />
                </View>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
        
    )
}