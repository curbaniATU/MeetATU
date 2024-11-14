// src/pages/Profile.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { getDoc, doc } from "firebase/firestore";
import { View, Text, Button, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";

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
            router.replace("/login"); // Navigate to login screen
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
                    source={{ uri: userDetails.profileImageUrl || /*"https://via.placeholder.com/150"*/ 
                        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/85b89f00-a0da-4d78-9db2-41fb7a4d9357/d2xm6bb-b9280965-9bce-4bd6-a555-ef4e91adf2d1.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzg1Yjg5ZjAwLWEwZGEtNGQ3OC05ZGIyLTQxZmI3YTRkOTM1N1wvZDJ4bTZiYi1iOTI4MDk2NS05YmNlLTRiZDYtYTU1NS1lZjRlOTFhZGYyZDEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.k8HcQbi78lMgnp1Lbgj2BCLwvUrHphrhWpiPc8FVWa8"
                    }}
                    style={styles.profileImage}
                />
                <Text style={styles.nameText}>{`${userDetails.firstName} ${userDetails.lastName}`}</Text>
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Bio:</Text>
                <Text style={styles.text}>{userDetails.bio || "No bio provided"}</Text>
                <Text style={styles.label}>Major:</Text>
                <Text style={styles.text}>{userDetails.major}</Text>
                <Text style={styles.label}>Classification:</Text>
                <Text style={styles.text}>{userDetails.classification}</Text>
            </View>

            {/* Custom Button to Go to Home */}
            <TouchableOpacity style={styles.button} onPress={() => router.push("/home")}>
                <Text style={styles.buttonText}>Go to homepage</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 100, // Add padding at the top to shift content down
        backgroundColor: "#f5f5f5",
    },
    loading: {
        flex: 1,
        justifyContent: "center",
    },
    header: {
        alignItems: "center",
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 30,
    },
    nameText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    detailsContainer: {
        marginVertical: 20,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    text: {
        fontSize: 16,
        color: "#555",
        marginBottom: 10,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    logoutButton: {
        backgroundColor: "#f54242",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
