import React, { useState, useEffect } from "react";
import { Alert, ActivityIndicator } from "react-native";
import {
  SafeAreaView, Text, TextInput,
  TouchableOpacity, Image,
  FlatList, StyleSheet, View
} from "react-native";
import { useRouter } from "expo-router";
import { db, auth } from "../comp/firebase"; // Ensure correct Firebase instance
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import BottomNavBar from '../comp/BottomNavBarForEvents';

interface ClassItem {
  code: string;
  title: string;
}

export default function RegisterClassesPage() {
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
            console.log("❌ No user is logged in.");
            Alert.alert("Error", "No user logged in.");
            return;
        }

        console.log(`✅ User found: ${user.uid}`);

        // Check if class exists in Firestore
        const classRef = doc(db, "classes", classCode);
        const classSnap = await getDoc(classRef);

        if (!classSnap.exists()) {
            console.log(`❌ Class ${classCode} not found in Firestore.`);
            Alert.alert("Error", `Class ${classCode} not found.`);
            return;
        }

        const classData = classSnap.data();
        console.log(`📄 Retrieved class data:`, classData);

        const classTitle = classData?.Title || "Unknown Title"; // Ensure correct field mapping
        console.log(`📝 Class title extracted: ${classTitle}`);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.log("❌ User document not found in Firestore.");
            Alert.alert("Error", "User profile not found.");
            return;
        }

        const userData = userSnap.data();
        const existingClasses = userData.classes || [];

        // Prevent duplicate class registrations
        if (existingClasses.some((c: ClassItem) => c.code === classCode)) {
            console.log(`⚠️ Class ${classCode} already registered.`);
            Alert.alert("Warning", "You are already registered for this class.");
            return;
        }

        console.log(`✅ Adding class ${classCode} to user profile...`);

        // Add class to user's profile
        await updateDoc(userRef, {
            classes: arrayUnion({ code: classCode, title: classTitle }),
        });

        console.log("🎉 Class added successfully!");

        // Update local state
        setRegisteredClasses(prev => [...prev, { code: classCode, title: classTitle }]);
        setClassCode("");

        Alert.alert("Success", `Class ${classCode} (${classTitle}) added to your profile.`);
    } catch (error) {
        console.error("❌ Error adding class:", error);
        Alert.alert("Error", "Failed to add class.");
    }
};



  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
    <SafeAreaView style={styles.container}>

      <Text style={styles.heading}>Register for Classes</Text>
      <Text style={styles.subheading}>It’s time to add your classes!</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Class Code"
        value={classCode}
        onChangeText={setClassCode}
      />

      <TouchableOpacity style={styles.enterButton} onPress={handleAddClass}>
        <Text style={styles.enterButtonText}>Submit</Text>
      </TouchableOpacity>

      <Text style={styles.subheading}>By submitting, you consent to sharing your class enrollment status with student in your same class.</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#007b5e" />
      ) : (
        <FlatList
          style={{ marginTop: 16, width: "100%" }}
          data={registeredClasses}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => (
            <View style={styles.classItem}>
              <Text style={styles.classText}>{item.title} ({item.code})</Text>
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
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#004d2b",
    marginTop: 60,
  },
  subheading: {
    fontSize: 18,
    color: "#007b5e",
    marginBottom: 16,
    marginTop: 8,
  },
  input: {
    width: "95%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#007b5e",
    borderRadius: 5,
    marginTop: 50,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  enterButton: {
    backgroundColor: "#007b5e",
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
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#004d2b",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  classText: {
    fontSize: 16,
    color: "#004d2b",
  },
});
