import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, StyleSheet, View, Platform, StatusBar,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
           {/* <Text style={styles.title}>Welcome </Text>}
             {/*logo placed here*/}
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}/>

            <View style={styles.widgetContainer}>
                {/*row 1*/}
                <View style={styles.row}>
                    <TouchableOpacity style={styles.widget} onPress={() => router.push("/messages")}>
                        <Ionicons name="chatbubbles-outline" size={40} color="white" />
                        <Text style={styles.widgetText}>Messages</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.widget} onPress={() => router.push("/profile")}>
                        <Ionicons name="person-circle-outline" size={40} color="white" />
                        <Text style={styles.widgetText}>Profile</Text>
                    </TouchableOpacity>
                </View>

                {/* Row 2 */}
                <View style={styles.row}>
                    <TouchableOpacity style={styles.widget} onPress={() => router.push("/events")}>
                        <Ionicons name="calendar-outline" size={40} color="white" />
                        <Text style={styles.widgetText}>Events</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.widget} onPress={() => router.push("/leaderboard")}>
                        <Ionicons name="trophy-outline" size={40} color="white" />
                        <Text style={styles.widgetText}>Leaderboard</Text>
                    </TouchableOpacity>
                    {/* Here just in case we need extra 
                    <TouchableOpacity style={styles.widget} onPress={() => router.push("/leaderboard")}>
                        <Ionicons name="(add icon here)" size={40} color="white" />
                        <Text style={styles.widgetText}>black</Text>
                    </TouchableOpacity>
                    */}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#E3E4E4',
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight || 50 : 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 50, // Space before widgets
    },
    widgetContainer: {
        position: 'absolute',
        bottom: 50, // Move widgets lower
        width: '90%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20, // Space between rows
    },
    widget: {
        width: '45%', // Keep widgets side by side
        height: 140,
        backgroundColor: '#24786D',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    widgetText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    logo:{
        width: 200, 
        height: 200,
        marginTop: 20,  
        marginBottom: 20,  
        resizeMode: 'contain', 
    }
});