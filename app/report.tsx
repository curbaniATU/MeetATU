import { useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import useThemeStore from "@/comp/themeStore";

export default function ReportPage() {
    const router = useRouter();
    const { darkMode } = useThemeStore(); 

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#f5f5f5" }]}>
 
            <Text style={[styles.heading, { color: darkMode ? "#ffffff" : "#333" }]}>
                Report a Problem
            </Text>

            <Text style={[styles.description, { color: darkMode ? "#cccccc" : "#555" }]}>
                To report problems, please email us at:
            </Text>

            <Text style={[styles.email, { color: darkMode ? "#80cbc4" : "#007b5e" }]}>
                support@meetatu.com
            </Text>

            {/* Back Button */}
            <TouchableOpacity 
                style={[styles.backButton, { backgroundColor: darkMode ? "#80cbc4" : "#007b5e" }]} 
                onPress={() => router.back()}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    description: {
        fontSize: 18,
        marginBottom: 5,
    },
    email: {
        fontSize: 18,
        fontWeight: "bold",
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
