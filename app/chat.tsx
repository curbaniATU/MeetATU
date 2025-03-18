import { useAvatar } from "@/comp/avatarFetch";
import { useChatStore } from "@/comp/chatStore";
import { db } from "@/comp/firebase";
import { useUserStore } from "@/comp/userStore";
import { router } from "expo-router";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { 
    Button, 
    Image, 
    StyleSheet, 
    Text, 
    View, 
    ScrollView, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform, 
    Keyboard, 
    TouchableWithoutFeedback 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { updateUserPoints } from "@/comp/points";
import useThemeStore from "@/comp/themeStore";
import { Ionicons } from "@expo/vector-icons";

export default function Chat() {
    const { darkMode } = useThemeStore();
    const [chat, setChat] = useState<any[]>([]);
    const [text, setText] = useState("");
    const [avatar, setAvatar] = useState();

    const { chatId, user } = useChatStore();
    const { currentUser } = useUserStore();
    const scrollViewRef = useRef<ScrollView | null>(null);

    const handleSend = async () => {
        if (text === "") return;
        try {
            await updateDoc(doc(db, "chatlogs", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                }),
            });

            await updateUserPoints(5);
            setText("");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [chat]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chatlogs", chatId), (response) => {
            setChat(response.data()?.messages || []);
        });

        return () => unSub();
    }, [chatId]);

    useEffect(() => {
        if (user?.profileAvatar) {
            const avatarRef = useAvatar(user.profileAvatar);
            setAvatar(avatarRef);
        }
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#ffffff" }]}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"} 
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
                        {/* Top Bar */}
                        <View style={[styles.userInfo, { borderColor: darkMode ? "#444" : "#24786D" }]}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={28} color={darkMode ? "#ffffff" : "#000000"} />
                            </TouchableOpacity>
                            <Image source={avatar} style={styles.avatar} />
                            <Text style={[styles.username, { color: darkMode ? "#ffffff" : "#000000" }]}>{user?.username}</Text>
                        </View>

                        {/* Chat Messages */}
                        <ScrollView 
                            style={styles.chatView} 
                            ref={scrollViewRef} 
                            keyboardShouldPersistTaps="handled"
                        >
                            {chat.map((message) => (
                                <View
                                    style={[
                                        message.senderId === currentUser.id ? styles.messageOwn : styles.message,
                                        { backgroundColor: message.senderId === currentUser.id ? (darkMode ? "#3EA325" : "#24786D") : darkMode ? "#222" : "#e5e3dc" },
                                    ]}
                                    key={message?.createdAt}
                                >
                                    <Text style={{ color: message.senderId === currentUser.id ? "#ffffff" : darkMode ? "#ffffff" : "#000000" }}>
                                        {message.text}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Text Input Area */}
                        <View style={[styles.textArea, { borderColor: darkMode ? "#444" : "#24786D" }]}>
                            <TextInput
                                style={[
                                    styles.input,
                                    { backgroundColor: darkMode ? "#333" : "#e5e3dc", color: darkMode ? "#ffffff" : "#000000" },
                                ]}
                                onChangeText={setText}
                                placeholder="Type message here..."
                                placeholderTextColor={darkMode ? "#aaaaaa" : "#C5C5C5"}
                                value={text}
                            />
                            <Button title="Send" onPress={handleSend} color={darkMode ? "#80cbc4" : "#24786D"} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    userInfo: {
        borderBottomWidth: 1,
        padding: 1,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#24786D",
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    backButton: {
        marginRight: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    username: {
        fontSize: 20,
        fontWeight: "bold",
    },
    chatView: {
        flex: 1,
        padding: 10,
    },
    message: {
        maxWidth: "100%",
        backgroundColor: "#e5e3dc",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    messageOwn: {
        maxWidth: "100%",
        backgroundColor: "#24786D",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: "flex-end",
    },
    textArea: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderTopWidth: 1,
        width: "100%",
    },
    input: {
        backgroundColor: "#e5e3dc",
        borderRadius: 15,
        padding: 10,
        marginRight: 10,
        width: "85%",
    },
});
