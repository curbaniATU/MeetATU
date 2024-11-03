import { Stack, useRouter } from "expo-router";
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
    </Stack>
  );
}
