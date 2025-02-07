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


  const handleDone = () => {
    router.replace("/home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Image source={require("../assets/images/left.png")} style={styles.backButtonImage} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Register for Classes</Text>
      <Text style={styles.subheading}>Now it’s time to add classes!</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Class Code"
        value={classCode}
        onChangeText={setClassCode}
      />

      <TouchableOpacity style={styles.enterButton} onPress={handleAddClass}>
        <Text style={styles.enterButtonText}>Enter</Text>
      </TouchableOpacity>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    padding: 16,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 5,
    padding: 6,
    borderRadius: 2,
  },
  backButtonImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  doneButton: {
    position: "absolute",
    top: 15,
    right: 20,
  },
  doneButtonText: {
    color: "#004d2b",
    fontSize: 16,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#004d2b",
    marginTop: 60,
  },
  subheading: {
    fontSize: 18,
    color: "#007b5e",
    marginBottom: 16,
  },
  input: {
    width: "95%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#007b5e",
    borderRadius: 5,
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
