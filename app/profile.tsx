import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../config/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TextInput, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";

export default function Profile() {
    const [userDetails, setUserDetails] = useState<any | null>(null);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [bio, setBio] = useState('');
    const [major, setMajor] = useState('');
    const [classification, setClassification] = useState('');
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
                        setBio(docSnap.data().bio || '');
                        setMajor(docSnap.data().major || '');
                        setClassification(docSnap.data().classification || '');
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

    const handleEditProfile = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                await updateDoc(docRef, {
                    bio: bio,
                    major: major,
                    classification: classification,
                });
                Alert.alert("Success", "Profile updated successfully!");
                setIsEditing(false);
                setUserDetails((prevDetails: any) => ({
                    ...prevDetails,
                    bio,
                    major,
                    classification,
                }));
            }
        } catch (error) {
            console.error("Update error:", error);
            Alert.alert("Error", "Could not update profile. Please try again.");
        }
    };

    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission Required", "We need access to your photos to upload profile pictures.");
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets?.length > 0) {
            uploadImage(result.assets[0].uri);
        } else {
            Alert.alert("Error", "No image selected.");
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            setUploading(true);

            if (!uri) {
                throw new Error("Invalid image. Please select a valid image.");
            }

            const response = await fetch(uri);
            const blob = await response.blob();

            const metadata = {
                contentType: "image/jpeg",
            };

            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated. Please log in again.");
            }

            const storageRef = ref(storage, `profile_pictures/${user.uid}.jpg`);
            await uploadBytes(storageRef, blob, metadata);

            const downloadURL = await getDownloadURL(storageRef);
            await updateDoc(doc(db, "users", user.uid), {
                profileImageUrl: downloadURL,
            });

            setUserDetails((prevDetails: any) => ({
                ...prevDetails,
                profileImageUrl: downloadURL,
            }));

            Alert.alert("Success", "Profile picture updated successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            const errorMessage = (error instanceof Error) ? error.message : "Could not upload image. Please try again.";
            Alert.alert("Error", errorMessage);        
        } finally {
            setUploading(false);
        }
    };

    if (!userDetails) {
        return <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={{ uri: userDetails.profileImageUrl || "https://via.placeholder.com/150" }}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <Text style={styles.nameText}>{`${userDetails.firstName} ${userDetails.lastName}`}</Text>
            </View>
            
            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Bio:</Text>
                {isEditing ? (
                    <TextInput 
                        style={styles.input}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Enter your bio"
                    />
                ) : (
                    <Text style={styles.text}>{bio || "No bio provided"}</Text>
                )}
                
                <Text style={styles.label}>Major:</Text>
                {isEditing ? (
                    <TextInput 
                        style={styles.input}
                        value={major}
                        onChangeText={setMajor}
                        placeholder="Enter your major"
                    />
                ) : (
                    <Text style={styles.text}>{major}</Text>
                )}
                
                <Text style={styles.label}>Classification:</Text>
                {isEditing ? (
                    <TextInput 
                        style={styles.input}
                        value={classification}
                        onChangeText={setClassification}
                        placeholder="Enter your classification"
                    />
                ) : (
                    <Text style={styles.text}>{classification}</Text>
                )}
            </View>

            {uploading && <ActivityIndicator size="large" color="#007bff" />}

            {isEditing ? (
                <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                    <Text style={styles.buttonText1}>Save Changes</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                    <Text style={styles.buttonText1}>Edit Profile</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.button} onPress={() => router.push("/home")}>
                <Text style={styles.buttonText1}>Go to homepage</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={async () => {
                await auth.signOut();
                router.replace("/login");
            }}>
                <Text style={styles.buttonText2}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 150,
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
    input: {
        fontSize: 16,
        color: "#333",
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        padding: 5,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText1: {
        color: "#007bff",
        fontSize: 16,
        fontWeight: "bold",
    },
    buttonText2: {
        color: "#f54242",
        fontSize: 16,
        fontWeight: "bold",
    },
});
