import React, { useState } from 'react';
import { Text, SafeAreaView, TextInput, Button, StyleSheet } from 'react-native';
import { Link, useRouter } from "expo-router";
import { auth, db } from "../comp/firebase";
import { setDoc, doc } from "firebase/firestore";
import { updateUserPoints } from "@/comp/points";  // Adjust import path
import useThemeStore from "@/comp/themeStore"; 


// Remove the header for this screen
export const unstable_settings = {
  headerShown: false,
};

export default function ProfileCreationScreen() {
    const router = useRouter();
    const { darkMode } = useThemeStore();

    const [username, setUsername] = useState('');
    const [bio, setBio] = useState(''); 
    const [major, setMajor] = useState('');  
    const [classification, setClassification] = useState('');  
    const [message, setMessage] = useState('');

    const handleProfileCompletion = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            if (username === '') {
                setMessage('Please enter your preferred name.');
            } else {
                const user = auth.currentUser;
                console.log(user);

                if (user) {
                    await setDoc(doc(db, "users", user.uid), {
                        username: username,
                        bio: bio,
                        major: major,
                        classification: classification,
                    }, { merge: true });
                }  

                setMessage('Profile created successfully');
                router.push("/home");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#E3E4E4" }]}>
            <Text style={[styles.header, { color: darkMode ? "#ffffff" : "#000000" }]}>Create Your Profile!</Text>

            <TextInput
                style={[
                    styles.input,
                    {
                      backgroundColor: darkMode ? "#333" : "#f9f9f9",
                      color: darkMode ? "#ffffff" : "#000000",
                      borderBottomColor: darkMode ? "#666" : "#C5C5C5",
                    },
                  ]}
                onChangeText={text => setUsername(text)}
                value={username}
                placeholder="Enter name: "
                placeholderTextColor={darkMode ? "#aaaaaa" : "#C5C5C5"}
                />

            <TextInput
                style={[
                    styles.input,
                    {
                      backgroundColor: darkMode ? "#333" : "#f9f9f9",
                      color: darkMode ? "#ffffff" : "#000000",
                      borderBottomColor: darkMode ? "#666" : "#C5C5C5",
                    },
                  ]}
                onChangeText={text => setBio(text)}
                value={bio}
                placeholder="Bio"
                placeholderTextColor={darkMode ? "#aaaaaa" : "#C5C5C5"}
                />

            <TextInput
                style={[
                    styles.input,
                    {
                      backgroundColor: darkMode ? "#333" : "#f9f9f9",
                      color: darkMode ? "#ffffff" : "#000000",
                      borderBottomColor: darkMode ? "#666" : "#C5C5C5",
                    },
                  ]}
                onChangeText={text => setMajor(text)}
                value={major}
                placeholder="Major"
                placeholderTextColor={darkMode ? "#aaaaaa" : "#C5C5C5"}
                />

            <TextInput
                style={[
                    styles.input,
                    {
                      backgroundColor: darkMode ? "#333" : "#f9f9f9",
                      color: darkMode ? "#ffffff" : "#000000",
                      borderBottomColor: darkMode ? "#666" : "#C5C5C5",
                    },
                  ]}
                onChangeText={text => setClassification(text)}
                value={classification}
                placeholder="Year of Graduation"
                placeholderTextColor={darkMode ? "#aaaaaa" : "#C5C5C5"}
                />

            <Button title="Complete Profile" onPress={handleProfileCompletion} />

            {message && <Text style={[styles.message, { color: darkMode ? "#80cbc4" : "green" }]}>{message}</Text>}
            </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#E3E4E4',
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
        paddingLeft: 16,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    message: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'green',
    },
});
