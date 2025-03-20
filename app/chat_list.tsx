import { db } from "@/comp/firebase";
import { useUserStore } from "@/comp/userStore";
import { useAvatar } from "@/comp/avatarFetch";
import { useChatStore } from "@/comp/chatStore";
import { useRouter } from "expo-router";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, FlatList, SafeAreaView, StatusBar } from "react-native";
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
                const userDocSnap = await getDoc(doc(db, "users", item.receiverId));
                return { ...item, user: userDocSnap.data() };
            });
            setChats((await Promise.all(promises)).sort((a, b) => b.updatedAt - a.updatedAt));
        });
        return () => chatListFetch();
    }, [currentUser.id]);

    useEffect(() => {
        const avatarMap: { [key: string]: any } = {};
        for (let chat of chats) {
            if (chat.user?.profileAvatar) avatarMap[chat.user.id] = useAvatar(chat.user.profileAvatar);
        }
        setAvatar(avatarMap);
    }, [chats]);

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#24786D" />
            <SafeAreaView style={{ backgroundColor: "#24786D" }} />
            <SafeAreaView style={{ flex: 1, backgroundColor: darkMode ? "#121212" : "#ffffff" }}>
                <View style={[styles.header, { backgroundColor: "#24786D" }]}>
                    <TouchableOpacity onPress={() => setSelectionMode(!selectionMode)} style={styles.iconButton}>
                        <Ionicons name="trash-outline" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>{selectionMode ? `${selectedChats.length} Selected` : "Messages"}</Text>
                    {!selectionMode ? (
                        <TouchableOpacity onPress={() => router.push("/createChat")} style={styles.iconButton}>
                            <Ionicons name="create-outline" size={28} color="white" />
                        </TouchableOpacity>
                    ) : selectedChats.length > 0 && (
                        <TouchableOpacity onPress={() => console.log("Delete chats")} style={styles.iconButton}>
                            <Ionicons name="checkmark-outline" size={28} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.chatId}
                    contentContainerStyle={{ paddingTop: 0 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.chatItem, { backgroundColor: darkMode ? "#1E1E1E" : "white", borderColor: darkMode ? "#444" : "#24786D" },
                                selectedChats.includes(item.chatId) && styles.selectedChat]}
                            onPress={() => {
                                if (selectionMode) {
                                    setSelectedChats((prev) =>
                                        prev.includes(item.chatId) ? prev.filter((id) => id !== item.chatId) : [...prev, item.chatId]
                                    );
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
                        </TouchableOpacity>
                    )}
                />
                <BottomNavBar />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    header: { height: 60, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#24786D", paddingHorizontal: 15 },
    iconButton: { padding: 10 },
    headerText: { fontSize: 20, fontWeight: "bold", color: "white", textAlign: "center", flex: 1 },
    chatItem: { borderBottomWidth: 1, padding: 10, flexDirection: "row", alignItems: "center" },
    chatUser: { fontSize: 18, fontWeight: "bold" },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    lastMessage: { color: "#949494" },
    selectedChat: { backgroundColor: "#ddd" },
    chatText: { flexDirection: "column", marginLeft: 10 }
});
