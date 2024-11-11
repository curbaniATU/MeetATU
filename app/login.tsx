import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../config/firebase";

export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully");
            router.replace("/profile"); // Use replace to avoid showing a back button
        } catch (error) {
            console.error("Login failed:", error);
            Alert.alert("Login Error", "Invalid email or password. Please try again.");
        }
    };

    return (      
        <SafeAreaView style={styles.container}>
            <Text style={styles.welcome}>Log in to Meet ATU</Text>
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
            <Button title="Continue" onPress={handleLogin} />
            <Link href="/signup" style={styles.switchText}>
                <Text style={styles.switchText}>Don't have an account? Sign up</Text>
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
        paddingLeft: 8,
        marginBottom: 10,
        borderRadius: 5,
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
        color: 'blue',
        marginTop: 15,
    },
});
