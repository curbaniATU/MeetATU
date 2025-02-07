import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, FlatList, StyleSheet, Platform, StatusBar, View } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../comp/firebase.js';
import { db, auth } from "../comp/firebase"; // Adjust the path if needed
import { doc, updateDoc, arrayUnion } from "firebase/firestore";


{/*const db = getFirestore(app);*/}

interface ClassData {
    id: string;
    Title: string;
    Instructor: string;
    students: string[];
}

export default function ClassesScreen() {
    const [classes, setClasses] = useState<ClassData[]>([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const classCollection = await getDocs(collection(db, 'classes'));
                const userCollection = await getDocs(collection(db, 'users')); // Fetch users instead
        
                const classData: ClassData[] = classCollection.docs.map(doc => ({
                    id: doc.id,
                    Title: doc.data().Title,
                    Instructor: doc.data().Instructor,
                    students: [] // Initially empty, will populate below
                }));
        
                const userData = userCollection.docs.map(doc => ({
                    name: doc.data().name,
                    enrolledClasses: doc.data().classes || [] // Ensure `classes` field exists
                }));
        
                // Attach students to their respective classes
                classData.forEach(classItem => {
                    classItem.students = userData
                        .filter(user => user.enrolledClasses.includes(classItem.id))
                        .map(user => user.name);
                });
        
                setClasses(classData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        

        fetchClasses();
    }, []);

    const renderItem = ({ item }: { item: ClassData }) => (
        <View style={styles.classContainer}>
            <Text style={styles.classTitle}>{item.Title}</Text>
            <Text style={styles.instructor}>Instructor: {item.Instructor}</Text>
            {item.students.length > 0 ? (
                <FlatList
                    data={item.students}
                    keyExtractor={(student, index) => index.toString()}
                    renderItem={({ item }) => <Text style={styles.student}>{item}</Text>}
                />
            ) : (
                <Text style={styles.noStudents}>No students enrolled</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Class List</Text>
            <FlatList
                data={classes}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
}

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
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    classContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    classTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 5,
    },
    instructor: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    student: {
        fontSize: 14,
        color: '#555',
        marginLeft: 10,
    },
    noStudents: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888',
    },
});
