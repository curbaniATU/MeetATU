import { useAvatar } from "@/comp/avatarFetch";
import { useChatStore } from "@/comp/chatStore";
import { db } from "@/comp/firebase";
import { useUserStore } from "@/comp/userStore";
import { router } from "expo-router";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Button, Image, StyleSheet, Text, View, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {
    const [chat, setChat] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [avatar, setAvatar] = useState();

    const { chatId, user } = useChatStore();
    const { currentUser } = useUserStore();

    const scrollViewRef = useRef<ScrollView | null>(null);

    const handleSend = async () => {
        if (text === "") return;

        try{
            await updateDoc(doc(db, "chatlogs", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                }),
            });

            const userIDs = [currentUser.id, user.id];
            
            userIDs.forEach(async (id) => {
                const chatRef = doc(db, "chats", id);
                const chatSnap = await getDoc(chatRef);

                if(chatSnap.exists()){
                    const chatData = chatSnap.data();
                    
                    const index = chatData.chats.findIndex((chat: { chatId: string; }) => chat.chatId === chatId);

                    chatData.chats[index].lastMessage = text;
                    chatData.chats[index].isSeen = id === currentUser.id ? true : false;
                    chatData.chats[index].updatedAt = Date.now();

                    await updateDoc(chatRef, {
                        chats: chatData.chats,
                    })

                }
            })
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [chat]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chatlogs", chatId), (response) =>{
            setChat(response.data()?.messages || []);
        })

        return () => {
            unSub();
        }
    }, [chatId]);

    useEffect(() => {
        if (user?.profileAvatar){
            const avatarRef = useAvatar(user.profileAvatar);
            setAvatar(avatarRef);
            console.log(avatar);
        }
    }, [])

    

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.userInfo}>
                <Image source={avatar} style={styles.avatar} />
                <Text style={styles.username}>{user?.username}</Text>
            </View>
            <ScrollView style={styles.chatView} ref={scrollViewRef}>
                {chat.map((message) => (
                    <View style={message.senderId === currentUser.id ? styles.messageOwn : styles.message} key={message?.createdAt}>
                        <Text style={message.senderId === currentUser.id ? styles.messageOwnText : styles.messageText} >{message.text}</Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.textArea}>
                <TextInput 
                style={styles.input} 
                onChangeText={text => setText(text)} 
                placeholder="Type message here..." 
                placeholderTextColor="C5C5C5" />
                <Button title="Send" onPress={handleSend} />

            </View>
        </SafeAreaView>
    )
    
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    username: {
        marginTop: 7,
        fontSize: 24,
        fontWeight: 'bold'
    },
    userInfo:{
        borderBottomWidth: 1,
        padding: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderColor: '#24786D'
    },
    avatar:{
        width:50,
        height: 50,
        borderRadius: 20,
        marginRight: 10
    },
    chatView:{
        display: 'flex',
        width:'100%',
        flex: 1,
        overflow: 'scroll',
        flexDirection: 'column',
        gap: 20,
        padding: 10,
    },
    message:{
        maxWidth: "100%",
        backgroundColor: "#e5e3dc",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems:'flex-end',
        alignSelf: 'flex-start',
    },
    messageOwn:{
        maxWidth: "100%",
        backgroundColor: "#24786D",
        flexDirection: 'row',
        alignItems: 'flex-end',
        color: 'white',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        alignSelf: 'flex-end',
    },
    messageOwnText:{
        color: 'white'
    },
    messageText:{
        color: 'black'
    },
    textArea: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#24786D',
        width: '100%',
    },
    input:{
        backgroundColor: '#e5e3dc',
        borderRadius: 15,
        padding: 10,
        marginRight: 10,
        width: '85%'
    },
    

})