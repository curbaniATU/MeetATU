import React, { useState, useEffect } from "react";
import { Alert, ActivityIndicator } from "react-native";
import {
  SafeAreaView, Text, TextInput,
  TouchableOpacity, Image,
  FlatList, StyleSheet, View
} from "react-native";
import { useRouter } from "expo-router";

interface ClassItem {
  name: string;
  code: string;
}

const API_URL = "http://your-server-ip:3000/classes"; // Replace with actual API

export default function RegisterClassesPage() {
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [registeredClasses, setRegisteredClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setRegisteredClasses(data);
      })
      .catch((err) => {
        console.log("Error fetching classes:", err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddClass = async () => {
    if (classCode.trim() === "" || className.trim() === "") {
      Alert.alert("Error", "Please enter both code and name.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: classCode, name: className }),
      });
      const result = await response.json();

      if (!response.ok) {
        Alert.alert("Error", result.error || "Unable to add class.");
      } else {
        setRegisteredClasses(result.classes);
        setClassCode("");
        setClassName("");
      }
    } catch (error) {
      console.error("Error adding class:", error);
      Alert.alert("Network Error", "Could not connect to the server.");
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
          keyExtractor={(item) => item.code || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.classItem}>
              <Text style={styles.classText}>{item.name} ({item.code})</Text>
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