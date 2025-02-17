import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, StyleSheet, View, Platform, StatusBar } from 'react-native';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from "../comp/firebase"; 
import BottomNavBar from '../comp/BottomNavForClasses';

interface ClassData {
  Instructor: string;
  id: string;
  code: string;
  title: string;
  students: string[]; // Add students array to store enrolled users
}

export default function ClassesScreen() {
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
        const allClasses: ClassData[] = classCollection.docs.map(doc => ({
          id: doc.id,
          code: doc.id, // Class ID is the code (e.g., "20015")
          title: doc.data().Title, // Use "Title" field from database
          Instructor: doc.data().Instructor,
          students: [] // Will be populated later
        }));

        // 🔥 Filter classes based on user's enrolled class codes
        const filteredClasses = allClasses.filter(classItem => 
          userClasses.includes(classItem.code)
        );

        // Fetch users to determine which students are in each class
        const usersCollection = await getDocs(collection(db, "users"));
        const users = usersCollection.docs.map(doc => {
          const userData = doc.data();
          return {
            id: doc.id,
            name: userData.username || `${userData.firstName} ${userData.lastName}`,
            enrolledClasses: userData.classes ? userData.classes.map((c: { code: string }) => c.code) : []
          };
        });

        // 🔥 Assign students to classes
        filteredClasses.forEach(classItem => {
          classItem.students = users
            .filter(user => user.enrolledClasses.includes(classItem.code))
            .map(user => user.name);
        });

        setClasses(filteredClasses);
      } catch (error) {
        console.error("❌ Error fetching class data:", error);
      }
    };

    fetchClasses();
  }, [userClasses]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Classes</Text>
      {classes.length > 0 ? (
        <FlatList
          data={classes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.classContainer}>
              <Text style={styles.classTitle}>{item.title} ({item.code})</Text>
              <Text style={styles.instructor}>Instructor: {item.Instructor}</Text>
              <Text style={styles.instructor}>Students Enrolled:</Text>
              {item.students.length > 0 ? (
                item.students.map((student, index) => (
                  <Text key={index} style={styles.studentName}>{student}</Text>
                ))
              ) : (
                <Text style={styles.noStudents}>No students enrolled.</Text>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noClasses}>You are not enrolled in any classes.</Text>
      )}
      <BottomNavBar />
    </SafeAreaView>
  );
}

// **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight || 50 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  classContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  classTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  instructor: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  studentName: {
    fontSize: 14,
    color: '#555',
    marginLeft: 10,
  },
  noStudents: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#888',
  },
  noClasses: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#888',
  },
});