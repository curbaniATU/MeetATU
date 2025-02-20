import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useThemeStore = create((set) => ({
    darkMode: false,
    setDarkMode: async (isDark) => {
        await AsyncStorage.setItem("darkMode", JSON.stringify(isDark));
        set({ darkMode: isDark });
    },
    loadDarkMode: async () => {
        const storedDarkMode = await AsyncStorage.getItem("darkMode");
        if (storedDarkMode !== null) {
            set({ darkMode: JSON.parse(storedDarkMode) });
        }
    }
}));

export default useThemeStore;
