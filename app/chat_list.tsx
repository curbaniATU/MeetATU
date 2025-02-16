import { db } from "@/comp/firebase";
import { useUserStore } from "@/comp/userStore";
import { useAvatar } from "@/comp/avatarFetch"
import { useChatStore } from "@/comp/chatStore"
import { useRouter } from "expo-router";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavBar from '../comp/BottomNavForMessages';


export default function ChatList() {
    const router = useRouter();
    const [avatar, setAvatar] = useState<{ [key: string]: any }>({});
    const [chats, setChats] = useState<any[]>([]);
    const { currentUser } = useUserStore();
    const { fetchChatInfo } = useChatStore();


    const handleSelect = async (chat: {chatId: string, user: string}) => {
        fetchChatInfo(chat.chatId, chat.user)
        router.push("/chat")
    }
    useEffect(() => {
        const chatListFetch = onSnapshot(doc(db, "chats", currentUser.id), async (response) => {
            const data = response.data()?.chats || [];
            
            const promises = data.map(async (item: {receiverId: string; }) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                console.log(item.receiverId)
                const user = userDocSnap.data();

                return { ...item, user };
            });

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a,b) => b.updateAt - a.updateAt));
        });
        
        return () => {
            chatListFetch();
        }
        
    }, [currentUser.id]);


    // Fetches User Avatars
    useEffect(() => {
        const avatarMap: { [key: string]: any } = {};

        for (let chat of chats) {
            if (chat.user?.profileAvatar) {
                avatarMap[chat.user.id] = useAvatar(chat.user.profileAvatar);
            }
        }

        setAvatar(avatarMap);
        console.log(avatar)
    }, [chats]);

    return (
        <SafeAreaView style={styles.container}>
            {chats.map((chat) => {
                console.log(avatar[chat.user.id]);
                return (
                    <TouchableOpacity style={styles.chatItem} key={chat.chatId} onPress={() => handleSelect(chat)}>
                        <View>
                            {avatar[chat.user.id] ? (
                                <Image source={avatar[chat.user.id]} style={styles.avatar} />
                            ) : (
                                <Text>Loading...</Text>
                            )}
                        </View>
                        <View style={styles.chatText}>
                            <Text style={styles.chatUser}>{chat.user.username}</Text>
                            <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
             <BottomNavBar />
        </SafeAreaView>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    chatItem: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        padding: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderColor: '#24786D'
    },
    chatUser: {
        marginTop:15,
        fontSize: 18,
        fontWeight: 'bold'
    },
    chatText: {
        flexDirection: 'column'
    },
    avatar: {
        width:75,
        height: 75,
        flex: 1,
        borderRadius: 20,
    },
    lastMessage: {
        color: '#949494'
    }
});