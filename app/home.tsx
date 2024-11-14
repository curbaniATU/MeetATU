// src/pages/home.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, Button, StyleSheet } from 'react-native';

export default function Home() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.comingSoon}>Coming soon!</Text>
            <Button 
                title="Back to Profile" 
                onPress={() => router.replace("/profile")}
                color="#007bff"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    comingSoon: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
});
