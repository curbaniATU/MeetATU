import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { auth, db } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function SignUpScreen() {
    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Define the approved email domain
    const approvedDomain = "@atu.edu";

    const handleSignUp = async (e: { preventDefault: () => void }) => {
        e.preventDefault();

        // Check if email matches the approved domain
        if (!email.endsWith(approvedDomain)) {
            Alert.alert("Invalid Email", `Please use an email address with the approved domain.`);
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Password Mismatch", "Passwords do not match. Please try again.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log(user);
            if (user) {
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    firstName: firstName,
                    lastName: lastName,
                });
            }
            console.log("User Registered Successfully!");
            router.push("/profile_creation");
        } catch (error) {
            console.log(error);
            Alert.alert("Registration Error", (error as Error).message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.welcome}>Sign up to Meet ATU</Text>
            <Text style={styles.appName}>Join our community today!</Text>

            <TextInput
                style={styles.input}
                onChangeText={setFirstName}
                value={firstName}
                placeholder="Enter your first name"
                placeholderTextColor="#C5C5C5"
            />
            <TextInput
                style={styles.input}
                onChangeText={setLastName}
                value={lastName}
                placeholder="Enter your last name"
                placeholderTextColor="#C5C5C5"
            />
            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Enter your email"
                placeholderTextColor="#C5C5C5"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Enter your password"
                placeholderTextColor="#C5C5C5"
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#C5C5C5"
                secureTextEntry
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
                <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>

            {/*<Button title="Register" onPress={handleSignUp} color="#24786D" />*/}
            <Link href="/login" style={styles.switchText}>
                <Text style={styles.switchText}>Already have an account? Log in</Text>
            </Link>
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
    welcome: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        marginBottom: 20,
    },
    switchText: {
        textAlign: 'center',
        color: 'black',
        marginTop: 15,
    },
    appName: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 100,
        color: 'grey',
    },
    registerButton: {
        backgroundColor: '#24786D',
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 15,
      },
      registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
});
