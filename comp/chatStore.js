import { create } from "zustand";
import { useUserStore } from "./userStore";

export const useChatStore = create((set, get) => ({
    chatId: null,
    user: null,
    messages: [],

    fetchChatInfo: async (chatId, user) => {
        set({ chatId, user });
    },

    sendMessage: async (message, uid, chatId) => {
        if (!message.trim() || !uid || !chatId) return;

        try {
            
            set((state) => ({
                messages: [...state.messages, { text: message, sender: uid, chatId }],
            }));

            console.log("Message sent:", message);

            useUserStore.getState().addPoints(uid, "message_classmate");

        } catch (error) {
            console.error("Error sending message:", error);
        }
    },
}));
