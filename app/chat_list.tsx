import { db } from "@/comp/firebase";
import { useUserStore } from "@/comp/userStore";
import { useAvatar } from "@/comp/avatarFetch";
import { useChatStore } from "@/comp/chatStore";
import { useRouter } from "expo-router";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from "../comp/BottomNavForMessages";
import { Ionicons } from "@expo/vector-icons";
import useThemeStore from "@/comp/themeStore"; 

export default function ChatList() {
    const router = useRouter();
    const { darkMode } = useThemeStore();
    const [avatar, setAvatar] = useState<{ [key: string]: any }>({});
    const [chats, setChats] = useState<any[]>([]);
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

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#ffffff" }]}>
            {/* Header with Messages Title and Trophy Button */}
            <View style={[styles.header, { backgroundColor: darkMode ? "#1E1E1E" : "#24786D" }]}>
                <Text style={[styles.headerText, { color: darkMode ? "#ffffff" : "#ffffff" }]}>Messages</Text>
                <TouchableOpacity onPress={() => router.push("/createChat")} style={styles.createButton}>
                    <Ionicons name="create-outline" size={40} color={darkMode ? "#80cbc4" : "white"} />
                </TouchableOpacity>
            </View>

            {/* Chat List */}
            {chats.map((chat) => (
                <TouchableOpacity
                style={[styles.chatItem, { backgroundColor: darkMode ? "#1E1E1E" : "white", borderColor: darkMode ? "#444" : "#24786D" }]}
                key={chat.chatId}
                    onPress={() => {
                        fetchChatInfo(chat.chatId, chat.user);
                        router.push("/chat");
                    }}
                >
                    <View>
                        {avatar[chat.user.id] ? (
                            <Image source={avatar[chat.user.id]} style={styles.avatar} />
                        ) : (
                            <Text style={{ color: darkMode ? "#ffffff" : "#000000" }}>Loading...</Text>
                        )}
                    </View>
                    <View style={styles.chatText}>
                        <Text style={[styles.chatUser, { color: darkMode ? "#ffffff" : "#000000" }]}>{chat.user.username}</Text>
                        <Text style={[styles.lastMessage, { color: darkMode ? "#aaaaaa" : "#949494" }]}>{chat.lastMessage}</Text>
                   </View>
                </TouchableOpacity>
            ))}

            <BottomNavBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E3E4E4",
    },
    header: {
        backgroundColor: "#24786D",
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        flex: 1,
    },
    trophyButton: {
        position: "absolute",
        right: 15,
    },
    chatItem: {
        borderBottomWidth: 1,
        padding: 10,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#24786D",
        backgroundColor: "white",
    },
    chatUser: {
        fontSize: 18,
        fontWeight: "bold",
    },
    chatText: {
        flexDirection: "column",
        marginLeft: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    lastMessage: {
        color: "#949494",
    },
    createButton: {
        position: "absolute",
        right: 15,
    },
});

