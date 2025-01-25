import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';

export default function Home() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome to Meet ATU</Text>

            <TouchableOpacity style={styles.block} onPress={() => router.push("/messages")}>
                <Text style={styles.blockText}>View Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.block} onPress={() => router.push("/profile")}>
                <Text style={styles.blockText}>View Your Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.block} onPress={() => router.push("/events")}>
                <Text style={styles.blockText}>View Events</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.block} onPress={() => router.replace("/home")}>
                <Text style={styles.blockText}>Blank - Placeholder</Text>
            </TouchableOpacity>
            {/* THIS IS A SAMPLE CODE SNIP FOR FUTURE BUTTONS */}
            {/* <TouchableOpacity style={styles.block} onPress={() => router.replace("/PAGE-NAME-HERE")}>
                <Text style={styles.blockText}>BUTTON-TEXT-HERE</Text>
            </TouchableOpacity> */}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight || 50 : 20,  // Adjust padding for iOS dynamic island
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 200, // Space below title to separate from buttons
    },
    block: {
        width: '90%',
        paddingVertical: 15,
        backgroundColor: '#007bff',
        borderRadius: 10,
        marginBottom: 20,  
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    blockText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
