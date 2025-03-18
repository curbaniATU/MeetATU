/*import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { User } from "firebase/auth";

export default function RootLayout() {
  //? This code is to allow for persistence, does not currently work on mobile.
  // const [user, setUser]=useState<User | null>(null);
  // const router = useRouter();
  // useEffect(() =>{
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setUser(user);
  //   });

  //   return () => unsubscribe();
  // }, []);

  // useEffect(() => {
  //   if (user) {
  //     router.push("/profile")
  //   }
  // })

  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="profile_creation" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="home" />
    </Stack>
  );
}  
  
this is the OG
*/


/*import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="profile_creation" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="home" />
    </Stack>
  );
}
  */

/*
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hides the header globally across the app
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="profile_creation" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="home" />
    </Stack>
  );
}
*/

import { auth } from "@/comp/firebase";
import { useUserStore } from "@/comp/userStore";
import { router, Stack, useRootNavigationState } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import useThemeStore from "@/comp/themeStore"; 

export default function RootLayout() {
  const { currentUser, fetchUserInfo } = useUserStore();
  const { darkMode, loadDarkMode } = useThemeStore(); 
  const [loading, setLoading] = useState(true);
  const navState = useRootNavigationState();
  const [themeLoaded, setThemeLoaded] = useState(false); // Track if theme is loaded
  
  useEffect(() => {
    async function loadTheme() {
      await loadDarkMode(); 
      setThemeLoaded(true);
    }
    loadTheme();

    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
      setLoading(false);

      if (navState?.key) {
        setTimeout(() => {
          if (user) {
            router.replace("/home");
          }
        }, 100);
      }
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo, navState?.key]);

  if (loading || !themeLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: darkMode ? "#121212" : "#ffffff" }}>
      <Stack screenOptions={{
        contentStyle: { backgroundColor: darkMode ? "#121212" : "#ffffff" }, // Applies to all screens
      }}>
        <Stack.Screen name="index" options={{ title: "Welcome", headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
        <Stack.Screen name="signup" options={{ title: "Sign Up", headerShown: false }} />
        <Stack.Screen name="profile_creation" options={{ title: "Create Profile", headerShown: false }} />
        <Stack.Screen name="leaderboard" options={{ title: "Leaderboard", headerShown: false }} />
        <Stack.Screen name="events" options={{ title: "Events", headerShown: false }} />
        <Stack.Screen name="chat_list" options={{ title: "Chat List", headerShown: false }} />
        <Stack.Screen name="chat" options={{ title: "Chat List", headerShown: false }} />
        <Stack.Screen name="profile" options={{ title: "Profile", headerShown: false }} />
        <Stack.Screen name="home" options={{ title: "Home", headerShown: false }} />
        <Stack.Screen name="setting" options={{ title: "Settings", headerShown: false }} />
        <Stack.Screen name="legal-policies" options={{ title: "Policies", headerShown: false }} />
        <Stack.Screen name="crn" options={{ title: "Add Classes", headerShown: false }} />
        <Stack.Screen name="classPage" options={{ title: "Classes", headerShown: false }} />
        <Stack.Screen name="createChat" options={{ title: "Create a Chat", headerShown: false }} />
      </Stack>
    </View>
  );
}

