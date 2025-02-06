import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';

export default function ReportPage() {
    const router = useRouter();
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Report a Problem</Text>
            <Text style={styles.description}>To report problems, please email us at:</Text>
            <Text style={styles.email}>support@meetatu.com</Text>
            
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    description: {
        fontSize: 18,
        color: '#555',
        marginBottom: 5,
    },
    email: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007b5e',
        marginBottom: 20,
    },
    backButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#007b5e',
        borderRadius: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
