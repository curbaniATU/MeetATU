import { useRouter } from 'expo-router';
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavBar() {
    const router = useRouter();

    return (
        <View style={styles.widgetContainer}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.widget} onPress={() => router.push("/home")}>
                    <Ionicons name="home-outline" size={30} color="white" />
                    <Text style={styles.widgetText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.widget} onPress={() => router.push("/chat_list")}>
                    <Ionicons name="chatbubbles-outline" size={30} color="white" />
                    <Text style={styles.widgetText}>Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.widget} onPress={() => router.push("/classPage")}>
                    <Ionicons name="school-outline" size={30} color="white" />
                    <Text style={styles.widgetText}>Classes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.widget} onPress={() => router.push("/leaderboard")}>
                    <Ionicons name="trophy-outline" size={30} color="white" />
                    <Text style={styles.widgetText}>Leaderboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.widget} onPress={() => router.push("/profile")}>
                    <Ionicons name="person-circle-outline" size={30} color="white" />
                    <Text style={styles.widgetText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.widget} onPress={() => router.push("/setting")}>
                    <Ionicons name="settings-outline" size={30} color="white" />
                    <Text style={styles.widgetText}>Settings</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    widgetContainer: {
       position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 100, // Set a fixed height for the whole bar
        backgroundColor: '#24786D', // Background color for the whole container
        flexDirection: 'row', // Align all the widgets horizontally
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',

    },
    widget: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    widgetText: {
        color: '#fff',
        fontSize: 12, // Slightly smaller font size
        fontWeight: '600',
        marginTop: 3,
    },
});
