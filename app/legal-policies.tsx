import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function LegalPoliciesPage() {
    const router = useRouter();
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.heading}>Legal & Policies</Text>
                <Text style={styles.sectionTitle}>Terms of Service</Text>
                <Text style={styles.text}>By using MeetATU, you agree to abide by our terms and conditions...</Text>
                
                <Text style={styles.sectionTitle}>Privacy Policy</Text>
                <Text style={styles.text}>Your privacy is important to us. We collect and store user data securely...</Text>
                
                <Text style={styles.sectionTitle}>Community Guidelines</Text>
                <Text style={styles.text}>We expect all users to maintain respectful and inclusive communication...</Text>
                
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#007b5e',
    },
    text: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
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
