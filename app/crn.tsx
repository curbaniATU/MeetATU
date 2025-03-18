import React, { useState } from "react";
import { Alert, ActivityIndicator } from "react-native";
import {
  SafeAreaView, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, View, Switch
} from "react-native";
import { useRouter } from "expo-router";
import { db, auth } from "../comp/firebase"; 
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import BottomNavBar from '../comp/BottomNavBarForEvents';
import useThemeStore from "@/comp/themeStore";  
import { Ionicons } from "@expo/vector-icons";

interface ClassItem {
  code: string;
  title: string;
}

export default function RegisterClassesPage() {
  const { darkMode } = useThemeStore();
  const [classCode, setClassCode] = useState("");
  const [registeredClasses, setRegisteredClasses] = useState<ClassItem[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleAddClass = async () => {
    if (!classCode.trim()) {
        Alert.alert("Error", "Please enter a class code.");
        return;
    }
    if (!isChecked) {
        Alert.alert("Error", "You must agree to the consent before proceeding.");
        return;
    }

    try {
        const user = auth.currentUser;
        if (!user) {
            Alert.alert("Error", "No user logged in.");
            return;
        }

        const classRef = doc(db, "classes", classCode);
        const classSnap = await getDoc(classRef);

        if (!classSnap.exists()) {
            Alert.alert("Error", `Class ${classCode} not found.`);
            return;
        }

        const classData = classSnap.data();
        const classTitle = classData?.Title || "Unknown Title";

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            Alert.alert("Error", "User profile not found.");
            return;
        }

        const userData = userSnap.data();
        const existingClasses = userData.classes || [];

        if (existingClasses.some((c: ClassItem) => c.code === classCode)) {
            Alert.alert("Warning", "You are already registered for this class.");
            return;
        }

        await updateDoc(userRef, {
            classes: arrayUnion({ code: classCode, title: classTitle }),
        });

        setRegisteredClasses(prev => [...prev, { code: classCode, title: classTitle }]);
        setClassCode("");
        setIsChecked(false);

        Alert.alert("Success", `Class ${classCode} (${classTitle}) added to your profile.`);
    } catch (error) {
        Alert.alert("Error", "Failed to add class.");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#f3f3f3" }]}>

      {/* Header with Back Button */}
      <View style={[styles.header, { backgroundColor: darkMode ? "#1E1E1E" : "#24786D" }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Register for Classes</Text>
        <View style={styles.iconButton} />
      </View>

      {/* Centered Subtitle */}
      <Text style={[styles.subheading, { color: darkMode ? "#ffffff" : "#004d2b" }]}>
        It’s time to add your classes!
      </Text>

      <View style={{ flex: 1, alignItems: "center" }}>
        <TextInput
          style={[styles.input, { backgroundColor: darkMode ? "#333" : "#fff", color: darkMode ? "#ffffff" : "#000000", borderColor: darkMode ? "#888" : "#007b5e" }]}
          placeholder="Enter Class Code"
          placeholderTextColor={darkMode ? "#aaaaaa" : "#555"}
          value={classCode}
          onChangeText={setClassCode}
        />
  
        <View style={styles.checkboxContainer}>
          <Switch
            value={isChecked}
            onValueChange={setIsChecked}
            trackColor={{ false: "#ccc", true: "#007b5e" }}
            thumbColor={isChecked ? "#ffffff" : "#666"}
          />
          <Text style={[styles.checkboxText, { color: darkMode ? "#aaaaaa" : "#007b5e" }]}>
            By submitting, you consent to sharing your class enrollment status with students in your same class.
          </Text>
        </View>
  
        <TouchableOpacity
          style={[styles.enterButton, { backgroundColor: isChecked ? "#007b5e" : "#aaa" }]}
          onPress={handleAddClass}
          disabled={!isChecked}
        >
          <Text style={styles.enterButtonText}>Submit</Text>
        </TouchableOpacity>
  
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
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#24786D",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  iconButton: { padding: 10 },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  subheading: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    width: "95%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 50,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginVertical: 10,
    paddingHorizontal: 10, 
  },
  checkboxText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  enterButton: {
    padding: 10,
    borderRadius: 20,
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