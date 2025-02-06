import { db } from "@/comp/firebase";
import { useUserStore } from "@/comp/userStore";
import { useRouter } from "expo-router";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatList() {
    const router = useRouter();

    const [chats, setChats] = useState<any[]>([]);
    const { currentUser } = useUserStore();

    console.log(currentUser.id);

    useEffect(() => {
        const chatListFetch = onSnapshot(doc(db, "chats", currentUser.id), async (response) => {
            const data = response.data()?.chats || [];
            
            const promises = data.map(async (item: {receiverId: string; }) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return { ...item, user };
            });

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a,b)=>b.updateAt - a.updateAt));
        });

        chatListFetch();
    }, [currentUser.id]);

    return (
        <SafeAreaView style={styles.container}>
            {chats.map((chat) => (
                <TouchableOpacity style={styles.chatItem}>
                    <Image source={chat.user.profileAvatar} style={styles.avatar}/>
                    <Text style={styles.chatUser}>{chat.user.username}</Text>
                </TouchableOpacity>
            ))}
        </SafeAreaView>
    )

}


const styles = StyleSheet.create({
    container: {

    },
    chatItem: {

    },
    chatUser: {

    },
    avatar: {

    }
});