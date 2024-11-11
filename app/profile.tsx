// src/pages/Profile.tsx
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { getDoc, doc } from "firebase/firestore";
import { View, Text, Button, Image, StyleSheet, ActivityIndicator } from "react-native";

export default function Profile() {
    const [userDetails, setUserDetails] = useState<any | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserDetails(docSnap.data());
                    } else {
                        console.log("No User Data exists");
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchUserDetails();
    }, []);

    async function handleLogout() {
        try {
            await auth.signOut();
            router.replace("/login"); // Replaces the stack with the login screen
            console.log("Sign Out Successful");
        } catch (error) {
            console.log(error);
        }
    }

    if (!userDetails) {
        return <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: userDetails.profileImageUrl || "https://via.placeholder.com/150" }}
                    style={styles.profileImage}
                />
                <Text style={styles.nameText}>{`${userDetails.firstName} ${userDetails.lastName}`}</Text>
                <Text style={styles.usernameText}>@{userDetails.username}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Bio:</Text>
                <Text style={styles.text}>{userDetails.bio || "No bio provided"}</Text>
                <Text style={styles.label}>Major:</Text>
                <Text style={styles.text}>{userDetails.major}</Text>
                <Text style={styles.label}>Classification:</Text>
                <Text style={styles.text}>{userDetails.classification}</Text>
            </View>
            <Button title="Logout" onPress={handleLogout} color="#f54242" />
        </View>
    );
}

Profile.Layout = function ProfileLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="profile"
                options={{
                    headerBackVisible: false,  // Hides the back button if it would otherwise appear
                }}
            />
        </Stack>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
    loading: { flex: 1, justifyContent: "center" },
    header: { alignItems: "center", marginBottom: 20 },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    nameText: { fontSize: 24, fontWeight: "bold", color: "#333" },
    usernameText: { fontSize: 16, color: "#666" },
    detailsContainer: { marginVertical: 20, backgroundColor: "#fff", padding: 15, borderRadius: 8 },
    label: { fontSize: 16, fontWeight: "bold", color: "#333" },
    text: { fontSize: 16, color: "#555", marginBottom: 10 },
});
