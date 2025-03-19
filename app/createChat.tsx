import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    View,
    TouchableOpacity,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { collection, onSnapshot, updateDoc, setDoc, serverTimestamp, doc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "@/comp/firebase";
import { useUserStore } from "@/comp/userStore";
import { useChatStore } from "@/comp/chatStore";
import useThemeStore from "@/comp/themeStore";
import { Ionicons } from "@expo/vector-icons"; // Import icons for back button

interface User {
    id: string;
    name: string;
    email?: string;
}

const CreateChat = () => {
    const router = useRouter();
    const { currentUser } = useUserStore();
    const { fetchChatInfo } = useChatStore();
    const { darkMode } = useThemeStore();

    // Search and User List
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Fetch Users Based on Search Query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setUsers([]);
            setShowDropdown(false);
            return;
        }

        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const filteredUsers = snapshot.docs
                .map((doc) => {
                    const userData = doc.data();
                    return {
                        id: doc.id,
                        name: userData.username || "Unknown User",
                        email: userData.email || "",
                    };
                })
                .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

            setUsers(filteredUsers);
            setShowDropdown(filteredUsers.length > 0);
        });

        return () => unsubscribe();
    }, [searchQuery]);

    // Create New Chat
    const startChat = async (user: User) => {
        if (!currentUser) {
            Alert.alert("Error", "You must be logged in to start a chat.");
            return;
        }

        const chatsRef = collection(db, "chats");
        const chatLogsRef = collection(db, "chatlogs");        
        
        try {
            const newChatLogsRef = doc(chatLogsRef);

            await setDoc(newChatLogsRef, {
                createdAt: serverTimestamp(),
                messages: [],
            });

            await updateDoc(doc(chatsRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatLogsRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now()
                }),
            });

            await updateDoc(doc(chatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatLogsRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now()
                }),
            });

            Alert.alert("Success", "Chat created!");
            const userDocRef = doc(db, "users", user.id);
            const userDocSnap = await getDoc(userDocRef);

            const recipient = userDocSnap.data();

            fetchChatInfo(newChatLogsRef.id, recipient);
            router.push("/chat"); // Navigate to chat
        } catch (error) {
            console.error("Error creating chat:", error);
            Alert.alert("Error", "Failed to create chat.");
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: darkMode ? "#121212" : "#E3E4E4" }}>
            {/* ✅ Matches Header Background Above Header */}
            <SafeAreaView style={{ backgroundColor: darkMode ? "#1E1E1E" : "#24786D" }} />

            {/* ✅ Properly Sized Header with Centered Title */}
            <View style={[styles.header, { backgroundColor: darkMode ? "#1E1E1E" : "#24786D" }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                
                {/* Centered title */}
                <View style={styles.headerTitleContainer}>
                    <Text style={[styles.headerText, { color: "white" }]}>Start a New Chat</Text>
                </View>

                {/* Invisible Text to Balance Header */}
                <Text style={{ color: "transparent", width: 40 }}>⠀</Text>
            </View>

            {/* Search Input */}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: darkMode ? "#333" : "#ffffff",
                        color: darkMode ? "#ffffff" : "#000000",
                        borderColor: darkMode ? "#888" : "#ccc",
                    },
                ]}
                placeholder="Search for a user..."
                placeholderTextColor={darkMode ? "#aaaaaa" : "#555"}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Dropdown List of Users */}
            {showDropdown && (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={[styles.userItem, { backgroundColor: darkMode ? "#1E1E1E" : "#ffffff" }]} 
                            onPress={() => startChat(item)}
                        >
                            <Text style={[styles.userText, { color: darkMode ? "#ffffff" : "#000000" }]}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#E3E4E4", // Matches Chat List page
    },
    header: {
        height: 60, // Matches the header height from Chat List
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#24786D", // Green header background
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: "center", // Ensures text is centered within header
    },
    iconButton: {
        padding: 10,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    input: { 
        padding: 10, 
        backgroundColor: "white", 
        marginTop: 15,
        borderRadius: 5,
        borderWidth: 1,
        marginHorizontal: 15, 
    },
    userItem: { 
        padding: 15, 
        borderBottomWidth: 1, 
        borderColor: "#ccc",
        marginHorizontal: 15,
        borderRadius: 5,
    },
    userText: { 
        fontSize: 16,
    },
});

export default CreateChat;
