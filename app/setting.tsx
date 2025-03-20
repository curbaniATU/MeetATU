import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView, Text, TouchableOpacity, Switch, StyleSheet, Alert, View, Image, Modal, FlatList, ActivityIndicator, StatusBar
} from "react-native";
import { auth, db } from "../comp/firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { useUserStore } from "../comp/userStore";
import BottomNavBar from '../comp/BottomNavBarForSettings';
import useThemeStore from "@/comp/themeStore";  
import { Ionicons } from "@expo/vector-icons"; 

const avatarOptions = [
    { filename: "black.png", source: require('../assets/Avatars/black.png') },
    { filename: "blueCowboy.png", source: require('../assets/Avatars/blueCowboy.png') },
    { filename: "greenCowboy.png", source: require('../assets/Avatars/greenCowboy.png') },
    { filename: "pinkTiara.png", source: require('../assets/Avatars/pinkTiara.png') },
    { filename: "red.png", source: require('../assets/Avatars/red.png') },
    { filename: "tealTiara.png", source: require('../assets/Avatars/tealTiara.png') }
];

export default function SettingsScreen() {
    const router = useRouter();
    const { currentUser, fetchUserInfo } = useUserStore();
    const { darkMode, setDarkMode, loadDarkMode } = useThemeStore();  
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<{ filename: string; source: any } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadDarkMode();  
        if (auth.currentUser?.uid) {
            fetchUserInfo(auth.currentUser.uid);
        }
    }, []);

    useEffect(() => {
        if (currentUser?.profileAvatar) {
            const foundAvatar = avatarOptions.find(avatar => avatar.filename === currentUser.profileAvatar);
            if (foundAvatar) setSelectedAvatar(foundAvatar);
        }
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            useUserStore.setState({ currentUser: null });
            router.replace("/login");
        } catch (error) {
            Alert.alert("Logout Error", "Failed to log out. Try again.");
        }
    };

    const handleAvatarSelection = async (avatar: { filename: string; source: any }) => {
        try {
            setLoading(true);
            setSelectedAvatar(avatar);
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                await updateDoc(docRef, { profileAvatar: avatar.filename });
                fetchUserInfo(user.uid);
                Alert.alert("Success", "Avatar updated successfully!");
            }
        } catch (error) {
            Alert.alert("Error", "Could not update avatar.");
        } finally {
            setModalVisible(false);
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: darkMode ? '#121212' : '#f5f5f5' }}>
            {/* ✅ Fix SafeAreaView and StatusBar */}
            <SafeAreaView style={{ backgroundColor: "#24786D" }} />
            <StatusBar barStyle="light-content" backgroundColor="#24786D" />
            
            {/* ✅ Fixed Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>

                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerText}>Settings</Text>
                </View>

                <View style={{ width: 40 }} /> {/* Spacer for alignment */}
            </View>

            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatarContainer}>
                    {selectedAvatar && <Image source={selectedAvatar.source} style={styles.profileImage} />}
                    <Text style={[styles.settingText, darkMode && styles.darkText]}>Change Avatar</Text>
                </TouchableOpacity>

                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <FlatList
                            contentContainerStyle={styles.modalContent}
                            data={avatarOptions}
                            numColumns={3}
                            keyExtractor={(item) => item.filename}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleAvatarSelection(item)}>
                                    <Image source={item.source} style={styles.avatarOption} />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Modal>

                {loading && <ActivityIndicator size="large" color="#007b5e" />}

                <TouchableOpacity style={styles.settingItem} onPress={() => setDarkMode(!darkMode)}>
                    <Text style={[styles.settingText, darkMode && styles.darkText]}>Dark Mode</Text>
                    <Switch value={darkMode} onValueChange={setDarkMode} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={() => setNotificationsEnabled(prev => !prev)}>
                    <Text style={[styles.settingText, darkMode && styles.darkText]}>Enable Notifications</Text>
                    <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} onPress={() => router.push("/crn")}> 
                    <Text style={[styles.settingText, darkMode && styles.darkText]}>Add Classes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/report')}> 
                    <Text style={[styles.settingText, darkMode && styles.darkText]}>Report</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/legal-policies')}> 
                    <Text style={[styles.settingText, darkMode && styles.darkText]}>Legal & Policies</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </SafeAreaView>
            
            <BottomNavBar />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#24786D",
        justifyContent: "space-between",
        paddingHorizontal: 15,
    },
    iconButton: { padding: 10 },
    headerTitleContainer: { flex: 1, alignItems: "center" },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
    },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    settingItem: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    settingText: { color: '#007b5e', fontSize: 18 },
    logoutButton: { marginTop: 20, backgroundColor: '#f54242', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 20, marginBottom: 200, alignItems: 'center' },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
    avatarContainer: { alignItems: 'center', marginBottom: 20 },
    modalContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.9)' 
    },
    modalContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1
    },
    avatarOption: { width: 80, height: 80, margin: 10, borderRadius: 40, borderWidth: 2, borderColor: '#fff' },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    darkText: { color: '#fff' },
});
