import { db } from "@/comp/firebase";
import { useUserStore } from "@/comp/userStore";
import { useAvatar } from "@/comp/avatarFetch";
import { useChatStore } from "@/comp/chatStore";
import { useRouter } from "expo-router";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../comp/BottomNavForMessages";
import { Ionicons } from "@expo/vector-icons";
import useThemeStore from "@/comp/themeStore"; 

export default function ChatList() {
    const router = useRouter();
    const { darkMode } = useThemeStore();
    const [avatar, setAvatar] = useState<{ [key: string]: any }>({});
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChats, setSelectedChats] = useState<string[]>([]);
    const [selectionMode, setSelectionMode] = useState(false);
    
    const { currentUser } = useUserStore();
    const { fetchChatInfo } = useChatStore();

    useEffect(() => {
        const chatListFetch = onSnapshot(doc(db, "chats", currentUser.id), async (response) => {
            const data = response.data()?.chats || [];

            const promises = data.map(async (item: { receiverId: string }) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();
                return { ...item, user };
            });

            const chatData = await Promise.all(promises);
            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            chatListFetch();
        };
    }, [currentUser.id]);

    useEffect(() => {
        const avatarMap: { [key: string]: any } = {};

        for (let chat of chats) {
            if (chat.user?.profileAvatar) {
                avatarMap[chat.user.id] = useAvatar(chat.user.profileAvatar);
            }
        }

        setAvatar(avatarMap);
    }, [chats]);

    // Toggle selection mode
    const toggleSelectionMode = () => {
        if (selectionMode && selectedChats.length === 0) {
            setSelectionMode(false); // Exit selection mode if no chats are selected
        } else {
            setSelectionMode(true); // Otherwise, enter selection mode
        }
    };

    // Handle chat selection
    const toggleChatSelection = (chatId: string) => {
        if (selectedChats.includes(chatId)) {
            setSelectedChats(selectedChats.filter((id) => id !== chatId));
        } else {
            setSelectedChats([...selectedChats, chatId]);
        }
    };

    // Delete selected chats
    const handleDeleteChats = async () => {
        try {
            const userChatRef = doc(db, "chats", currentUser.id);
            const userChatSnap = await getDoc(userChatRef);
            
            if (userChatSnap.exists()) {
                const userChats = userChatSnap.data()?.chats || [];
                const updatedChats = userChats.filter((chat: any) => !selectedChats.includes(chat.chatId));
                await updateDoc(userChatRef, { chats: updatedChats });
            }

            // Also delete chats from the receivers
            for (const chatId of selectedChats) {
                const chat = chats.find((chat) => chat.chatId === chatId);
                if (chat) {
                    const receiverChatRef = doc(db, "chats", chat.user.id);
                    const receiverChatSnap = await getDoc(receiverChatRef);

                    if (receiverChatSnap.exists()) {
                        const receiverChats = receiverChatSnap.data()?.chats || [];
                        const updatedReceiverChats = receiverChats.filter((c: any) => c.chatId !== chatId);
                        await updateDoc(receiverChatRef, { chats: updatedReceiverChats });
                    }
                }
            }

            // Update local state
            setChats(chats.filter((chat) => !selectedChats.includes(chat.chatId)));
            setSelectedChats([]);
            setSelectionMode(false);
        } catch (error) {
            console.error("Error deleting chats:", error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: darkMode ? "#121212" : "#ffffff" }}>
            {/* ✅ Replaced SafeAreaView with a simple View for header background */}
            <View style={{ height: 44, backgroundColor: darkMode ? "#1E1E1E" : "#24786D" }} />

            {/* ✅ Header with Correct Height & Centered Text */}
            <View style={[styles.header, { backgroundColor: darkMode ? "#1E1E1E" : "#24786D" }]}>
                <TouchableOpacity onPress={toggleSelectionMode} style={styles.iconButton}>
                    <Ionicons name="trash-outline" size={28} color="white" />
                </TouchableOpacity>

                <Text style={[styles.headerText, { color: "white" }]}>
                    {selectionMode ? `${selectedChats.length} Selected` : "Messages"}
                </Text>

                {selectionMode && selectedChats.length > 0 && (
                    <TouchableOpacity onPress={handleDeleteChats} style={styles.iconButton}>
                        <Ionicons name="checkmark-outline" size={28} color="white" />
                    </TouchableOpacity>
                )}

                {!selectionMode && (
                    <TouchableOpacity onPress={() => router.push("/createChat")} style={styles.iconButton}>
                        <Ionicons name="create-outline" size={28} color="white" />
                    </TouchableOpacity>
                )}
            </View>

            {/* ✅ Chat List without Extra Space */}
            <FlatList
                data={chats}
                keyExtractor={(item) => item.chatId}
                contentContainerStyle={{ paddingTop: 0 }} // ✅ Fixes extra space above first chat
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.chatItem,
                            { backgroundColor: darkMode ? "#1E1E1E" : "white", borderColor: darkMode ? "#444" : "#24786D" },
                            selectedChats.includes(item.chatId) && styles.selectedChat,
                        ]}
                        onPress={() => {
                            if (selectionMode) {
                                toggleChatSelection(item.chatId);
                            } else {
                                fetchChatInfo(item.chatId, item.user);
                                router.push("/chat");
                            }
                        }}
                    >
                        <Image source={avatar[item.user.id]} style={styles.avatar} />
                        <View style={styles.chatText}>
                            <Text style={[styles.chatUser, { color: darkMode ? "#ffffff" : "#000000" }]}>{item.user.username}</Text>
                            <Text style={[styles.lastMessage, { color: darkMode ? "#aaaaaa" : "#949494" }]}>{item.lastMessage}</Text>
                        </View>
                        {selectionMode && (
                            <Ionicons
                                name={selectedChats.includes(item.chatId) ? "checkmark-circle" : "ellipse-outline"}
                                size={28}
                                color={selectedChats.includes(item.chatId) ? "#4CAF50" : "#aaa"}
                            />
                        )}
                    </TouchableOpacity>
                )}
            />

            <BottomNavBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
    },
    iconButton: { padding: 10 },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        flex: 1,
    },
    chatItem: {
        borderBottomWidth: 1,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    chatUser: { fontSize: 18, fontWeight: "bold" },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    lastMessage: { color: "#949494" },
    selectedChat: { backgroundColor: "#ddd" },
    chatText: {
        flexDirection: "column",
        marginLeft: 10,
    },
});

//export default ChatList;
