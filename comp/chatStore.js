import { create } from "zustand"
import { useUserStore } from "./userStore" 

export const useChatStore = create((set) => ({
    chatId
}))