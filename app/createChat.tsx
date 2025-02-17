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
import { collection, addDoc, onSnapshot, updateDoc, setDoc, serverTimestamp, doc, arrayUnion, getDoc } from "firebase/firestore";
import { db, auth } from "@/comp/firebase";
import { useUserStore } from "@/comp/userStore";
import { useChatStore } from "@/comp/chatStore";

interface User {
    id: string;
    name: string;
    email?: string;
}

const CreateChat = () => {
    const router = useRouter();
    const { currentUser } = useUserStore();
    const { fetchChatInfo } = useChatStore();

    // Search and User List
    const [recipient, setRecipient ] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // **Fetch Users Based on Search Query**
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

    // **Create New Chat**
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
                chats:arrayUnion({
                    chatId: newChatLogsRef.id,
                    lastMessage: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now()
                }),
                
            });

            await updateDoc(doc(chatsRef, currentUser.id), {
                chats:arrayUnion({
                    chatId: newChatLogsRef.id,
                    lastMessage: "",
                    receiverId: user.id,
                    updatedAt: Date.now()
                }),
                
            });

            Alert.alert("Success", "Chat created!");
            const userDocRef = doc(db, "users", user.id);
            const userDocSnap = await getDoc(userDocRef)

            const recipient = userDocSnap.data();

            console.log(newChatLogsRef.id, recipient);
            fetchChatInfo(newChatLogsRef.id, recipient);
            router.push("/chat"); // Navigate to chat
        } catch (error) {
            console.error("Error creating chat:", error);
            Alert.alert("Error", "Failed to create chat.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Start a New Chat</Text>

            <TextInput
                style={styles.input}
                placeholder="Search users..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {showDropdown && (
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.userItem} onPress={() => startChat(item)}>
                            <Text style={styles.userText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            <TouchableOpacity style={styles.backButton} onPress={() => router.push("/chat_list")}>
                <Text style={styles.backButtonText}>Back to Messages</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#E3E4E4" },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    input: { padding: 10, backgroundColor: "white", marginBottom: 10, borderRadius: 5 },
    userItem: { padding: 15, borderBottomWidth: 1, borderColor: "#ccc" },
    userText: { fontSize: 16 },
    backButton: { marginTop: 10, backgroundColor: "#24786D", padding: 10, borderRadius: 5, alignItems: "center" },
    backButtonText: { color: "white", fontSize: 16 },
});

export default CreateChat;
