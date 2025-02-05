import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../comp/firebase";

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully");
            router.replace("/home"); // Use replace to avoid showing a back button
        } catch (error) {
            console.error("Login failed:", error);
            Alert.alert("Login Error", "Invalid email or password. Please try again.");
        }
    };

    return (      
        <SafeAreaView style={styles.container}>
            <Text style={styles.welcome}>Log in to Meet ATU</Text>
            <Text style={styles.appName}>Welcome Back!</Text>
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
            <Button title="Continue" onPress={handleLogin} color="#24786D" />
            <Link href="/signup" style={styles.switchText}>
                <Text style={styles.switchText}>Don't have an account? Sign up</Text>
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
        borderBottomColor: '#C5C5C5', // Make sure to add the '#' for valid color
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
});
