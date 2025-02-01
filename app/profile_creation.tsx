import React, { useState } from 'react';
import { Text, SafeAreaView, TextInput, Button, StyleSheet } from 'react-native';
import { Link, useRouter } from "expo-router";

import { auth, db } from "../config/firebase"
import { setDoc, doc} from "firebase/firestore"

export default function ProfileCreationScreen() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [bio, setBio] = useState(''); 
    const [major, setMajor] = useState('');  
    const [classification, setClassification] = useState('');  
    const [message, setMessage] = useState('');

    const handleProfileCompletion =async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            if (username === '') {
        setMessage('Please enter your preferred name.');
        } else {
            
            const user=auth.currentUser;
            console.log(user);

            if(user){
                await setDoc(doc(db, "users", user.uid), {
                    username: username,
                    bio: bio,
                    major: major,
                    classification: classification,
                }, {merge: true});
            }  
            
            setMessage('Profile created successfully');
            router.push("/profile")
            
        }
        }
        catch(error) {
            console.log(error)
        }
        
    };

    return (
        <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Create Your Profile!</Text>

        <TextInput
            style={styles.input}
            onChangeText={text => setUsername(text)}
            value={username}
            placeholder="Enter name: "
            placeholderTextColor="#C5C5C5"
        />

        <TextInput
            style={styles.input}
            onChangeText={text => setBio(text)}
            value={bio}
            placeholder="Bio"
            placeholderTextColor="#C5C5C5"
        />

        <TextInput
            style={styles.input}
            onChangeText={text => setMajor(text)}
            value={major}
            placeholder="Major"
            placeholderTextColor="#C5C5C5"
        />

        <TextInput
            style={styles.input}
            onChangeText={text => setClassification(text)}
            value={classification}
            placeholder="Graduation Year"
            placeholderTextColor="#C5C5C5"
        />

        <Button title="Complete Profile" onPress={handleProfileCompletion} color="#24786D" />

        {message && <Text style={styles.message}>{message}</Text>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#C5C5C5',
        paddingLeft: 8,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    message: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'black',
    },
});