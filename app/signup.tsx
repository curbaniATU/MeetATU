import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, } from 'react-native';

import { auth, db } from "../config/firebase"
import { createUserWithEmailAndPassword} from "firebase/auth";
import { setDoc, doc} from "firebase/firestore"


export default function SignUpScreen() {

    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp =async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            const user=auth.currentUser;
            console.log(user);
            if(user){
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    firstName: firstName,
                    lastName: lastName,
                });
            }
            console.log("User Registered Successfully!!!")
            router.push("/profile_creation")
        } 
        catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.welcome}>Sign up for Meet ATU</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => setFirstName(text)}
                value={firstName}
                placeholder="Enter your first name"
                placeholderTextColor="#C5C5C5"
            />
            <TextInput
                style={styles.input}
                onChangeText={(text) => setLastName(text)}
                value={lastName}
                placeholder="Enter your last name"
                placeholderTextColor="#C5C5C5"
            />
            <TextInput
                style={styles.input}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="Enter your email"
                placeholderTextColor="#C5C5C5"
            />
            <TextInput
                style={styles.input}
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholder="Enter your password"
                placeholderTextColor="#C5C5C5"
                secureTextEntry
            />
            <Button title="Register" onPress={handleSignUp} />
            <Link href="/login" style={styles.switchText}>
                <Text style={styles.switchText}>Already have an account? Log in</Text>
            </Link>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
        justifyContent: 'center',
        padding: 8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 4,
        marginBottom: 10,
    },
    welcome: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 20,
    },
    switchText: {
        textAlign: 'center',
        color: 'blue',
        marginTop: 15,
    },
});