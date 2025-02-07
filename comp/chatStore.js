import { create } from "zustand"
import { useUserStore } from "./userStore" 

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    fetchChatInfo: async (chatId, user) => {
        set({chatId, user});
    }
}))