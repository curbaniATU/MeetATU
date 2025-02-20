import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, FlatList, StyleSheet, View, Platform, StatusBar } from "react-native";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../comp/firebase";
import BottomNavBar from "../comp/BottomNavForClasses";
import useThemeStore from "@/comp/themeStore"; 

interface ClassData {
  Instructor: string;
  id: string;
  code: string;
  title: string;
  students: string[]; // Add students array to store enrolled users
}

export default function ClassesScreen() {
  const { darkMode } = useThemeStore(); 
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [userClasses, setUserClasses] = useState<string[]>([]);
  const currentUser = auth.currentUser?.uid;

  // **Fetch User's Enrolled Classes**
  useEffect(() => {
    const fetchUserClasses = async () => {
      if (!currentUser) return;
      try {
        const userRef = doc(db, "users", currentUser);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData && Array.isArray(userData.classes)) {
            setUserClasses(userData.classes.map((c: { code: string }) => c.code));
          }
        }
      } catch (error) {
        console.error("Error fetching user classes:", error);
      }
    };

    fetchUserClasses();
  }, [currentUser]);

  // **Fetch Classes and Students**
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classCollection = await getDocs(collection(db, "classes"));
        const allClasses: ClassData[] = classCollection.docs.map((doc) => ({
          id: doc.id,
          code: doc.id, // Class ID is the code (e.g., "20015")
          title: doc.data().Title, // Use "Title" field from database
          Instructor: doc.data().Instructor,
          students: [], // Will be populated later
        }));

        // 🔥 Filter classes based on user's enrolled class codes
        const filteredClasses = allClasses.filter((classItem) =>
          userClasses.includes(classItem.code)
        );

        // Fetch users to determine which students are in each class
        const usersCollection = await getDocs(collection(db, "users"));
        const users = usersCollection.docs.map((doc) => {
          const userData = doc.data();
          return {
            id: doc.id,
            name: userData.username || `${userData.firstName} ${userData.lastName}`,
            enrolledClasses: userData.classes
              ? userData.classes.map((c: { code: string }) => c.code)
              : [],
          };
        });

        // 🔥 Assign students to classes
        filteredClasses.forEach((classItem) => {
          classItem.students = users
            .filter((user) => user.enrolledClasses.includes(classItem.code))
            .map((user) => user.name);
        });

        setClasses(filteredClasses);
      } catch (error) {
        console.error("❌ Error fetching class data:", error);
      }
    };

    fetchClasses();
  }, [userClasses]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#f5f5f5" }]}
    >
      {/* ✅ Dynamic text color for title */}
      <Text style={[styles.title, { color: darkMode ? "#ffffff" : "#333" }]}>Your Classes</Text>

      {classes.length > 0 ? (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.classContainer,
                { backgroundColor: darkMode ? "#1E1E1E" : "#ffffff" },
              ]}
            >
              {/* ✅ Apply dynamic text colors */}
              <Text style={[styles.classTitle, { color: darkMode ? "#80cbc4" : "#007bff" }]}>
                {item.title} ({item.code})
              </Text>
              <Text style={[styles.instructor, { color: darkMode ? "#cccccc" : "#333" }]}>
                Instructor: {item.Instructor}
              </Text>
              <Text style={[styles.instructor, { color: darkMode ? "#cccccc" : "#333" }]}>
                Students Enrolled:
              </Text>

              {item.students.length > 0 ? (
                item.students.map((student, index) => (
                  <Text key={index} style={[styles.studentName, { color: darkMode ? "#aaaaaa" : "#555" }]}>
                    {student}
                  </Text>
                ))
              ) : (
                <Text style={[styles.noStudents, { color: darkMode ? "#888" : "#888" }]}>
                  No students enrolled.
                </Text>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={[styles.noClasses, { color: darkMode ? "#aaaaaa" : "#888" }]}>
          You are not enrolled in any classes.
        </Text>
      )}

      <BottomNavBar />
    </SafeAreaView>
  );
}

// **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight || 50 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  classContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  instructor: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  studentName: {
    fontSize: 14,
    marginLeft: 10,
  },
  noStudents: {
    fontSize: 14,
    fontStyle: "italic",
  },
  noClasses: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
  },
});
