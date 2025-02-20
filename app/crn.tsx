import React, { useState, useEffect } from "react";
import { Alert, ActivityIndicator } from "react-native";
import {
  SafeAreaView, Text, TextInput,
  TouchableOpacity, FlatList, StyleSheet, View
} from "react-native";
import { useRouter } from "expo-router";
import { db, auth } from "../comp/firebase"; // Ensure correct Firebase instance
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import BottomNavBar from '../comp/BottomNavBarForEvents';
import useThemeStore from "@/comp/themeStore";  

interface ClassItem {
  code: string;
  title: string;
}

export default function RegisterClassesPage() {
  const { darkMode } = useThemeStore();  
  const [classCode, setClassCode] = useState("");
  const [registeredClasses, setRegisteredClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleAddClass = async () => {
    if (!classCode.trim()) {
        Alert.alert("Error", "Please enter a class code.");
        return;
    }

    try {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "No user logged in.");
            return;
        }

        // Check if class exists in Firestore
        const classRef = doc(db, "classes", classCode);
        const classSnap = await getDoc(classRef);

        if (!classSnap.exists()) {
            Alert.alert("Error", `Class ${classCode} not found.`);
            return;
        }

        const classData = classSnap.data();
        const classTitle = classData?.Title || "Unknown Title"; // Ensure correct field mapping

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            Alert.alert("Error", "User profile not found.");
            return;
        }

        const userData = userSnap.data();
        const existingClasses = userData.classes || [];

        // Prevent duplicate class registrations
        if (existingClasses.some((c: ClassItem) => c.code === classCode)) {
            Alert.alert("Warning", "You are already registered for this class.");
            return;
        }

        // Add class to user's profile
        await updateDoc(userRef, {
            classes: arrayUnion({ code: classCode, title: classTitle }),
        });

        // Update local state
        setRegisteredClasses(prev => [...prev, { code: classCode, title: classTitle }]);
        setClassCode("");

        Alert.alert("Success", `Class ${classCode} (${classTitle}) added to your profile.`);
    } catch (error) {
        Alert.alert("Error", "Failed to add class.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#f3f3f3" }]}>
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        
       
        <Text style={[styles.heading, { color: darkMode ? "#ffffff" : "#004d2b" }]}>Register for Classes</Text>
        <Text style={[styles.subheading, { color: darkMode ? "#cccccc" : "#007b5e" }]}>It’s time to add your classes!</Text>
        
        <TextInput
          style={[styles.input, { backgroundColor: darkMode ? "#333" : "#fff", color: darkMode ? "#ffffff" : "#000000", borderColor: darkMode ? "#888" : "#007b5e" }]}
          placeholder="Enter Class Code"
          placeholderTextColor={darkMode ? "#aaaaaa" : "#555"}
          value={classCode}
          onChangeText={setClassCode}
        />

        <TouchableOpacity style={[styles.enterButton, { backgroundColor: darkMode ? "#007b5e" : "#007b5e" }]} onPress={handleAddClass}>
          <Text style={styles.enterButtonText}>Submit</Text>
        </TouchableOpacity>

        <Text style={[styles.subheading, { color: darkMode ? "#aaaaaa" : "#007b5e" }]}>By submitting, you consent to sharing your class enrollment status with students in your same class.</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={darkMode ? "#ffffff" : "#007b5e"} />
        ) : (
          <FlatList
            style={{ marginTop: 16, width: "100%" }}
            data={registeredClasses}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <View style={[styles.classItem, { backgroundColor: darkMode ? "#1E1E1E" : "#f9f9f9", borderColor: darkMode ? "#555" : "#004d2b" }]}>
                <Text style={[styles.classText, { color: darkMode ? "#ffffff" : "#004d2b" }]}>{item.title} ({item.code})</Text>
              </View>
            )}
          />
        )}
      </SafeAreaView>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 60,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 16,
    marginTop: 8,
  },
  input: {
    width: "95%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 50,
    marginBottom: 16,
  },
  enterButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "95%",
  },
  enterButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  classItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  classText: {
    fontSize: 16,
  },
});
