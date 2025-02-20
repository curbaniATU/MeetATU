import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, Text, ScrollView, TouchableOpacity, StyleSheet, View } from "react-native";
import useThemeStore from "@/comp/themeStore"; 

export default function LegalPoliciesPage() {
    const router = useRouter();
    const { darkMode } = useThemeStore();  

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#f5f5f5" }]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <Text style={[styles.heading, { color: darkMode ? "#ffffff" : "#333" }]}>
                    Legal & Policies
                </Text>
                <Text style={[styles.sectionTitle, { color: darkMode ? "#80cbc4" : "#007b5e" }]}>Terms of Service</Text>
                <Text style={[styles.text, { color: darkMode ? "#cccccc" : "#555" }]}>
                    By using MeetATU, you agree to abide by our terms and conditions...
                </Text>
                
                <Text style={[styles.sectionTitle, { color: darkMode ? "#80cbc4" : "#007b5e" }]}>Privacy Policy</Text>
                <Text style={[styles.text, { color: darkMode ? "#cccccc" : "#555" }]}>
                    Your privacy is important to us. We collect and store user data securely...
                </Text>

                <Text style={[styles.sectionTitle, { color: darkMode ? "#80cbc4" : "#007b5e" }]}>Community Guidelines</Text>
                <Text style={[styles.text, { color: darkMode ? "#cccccc" : "#555" }]}>
                    We expect all users to maintain respectful and inclusive communication...
                </Text>

                {/* ✅ Back Button */}
                <TouchableOpacity style={[styles.backButton, { backgroundColor: darkMode ? "#80cbc4" : "#007b5e" }]} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollContainer: {
        alignItems: "center",
        paddingBottom: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 15,
    },
    text: {
        fontSize: 16,
        textAlign: "center",
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    backButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    backButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
