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
import { useUserStore } from "@/comp/userStore"
import { router, Stack, useRootNavigationState } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
//import { Button } from "react-native";

export default function RootLayout() {
  const { currentUser, fetchUserInfo } = useUserStore();
  const [loading, setLoading] = useState(true);
  const navState = useRootNavigationState();
  
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);

      setLoading(false);

      if (navState?.key) {
        setTimeout(() => {
          if(user){
            router.replace("/home");
          }
        }, 100);
        
      }
        
    });

    return () => {
      unSub();
    }
  }, [fetchUserInfo, navState?.key]);

  if (loading) return null;

  return (
    <Stack>

      <Stack.Screen 
        name="index" 
        options={{ title: "Welcome", headerShown: false }}
      />
      <Stack.Screen 
        name="login" 
        options={{ title: "Login", headerShown: false  }}
      />
      <Stack.Screen 
        name="signup" 
        options={{ title: "Sign Up", headerShown: false  }}
      />
      <Stack.Screen 
        name="profile_creation" 
        options={{ title: "Create Profile", headerShown: false }}
      />
      <Stack.Screen 
        name="profile" 
        options={{
          title: "Profile", headerShown: false}}
          /*headerLeft: ({ canGoBack }) => (
            canGoBack ? (
              <Button title="Home page" onPress={() => {
                  router.replace("/home"); }} // Goes to home screen
                color="#007bff" // Custom color for the button
              />
            ) : null
          ),*/
      />
      <Stack.Screen 
        name="home" 
        options={{ title: "Home", headerShown: false }}
      />
    </Stack>
  );
}
