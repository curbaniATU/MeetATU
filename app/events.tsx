import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, Text, StyleSheet, TextInput, FlatList, View,
  TouchableOpacity, Alert, Platform, StatusBar, Modal, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc, updateDoc, doc, onSnapshot, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../comp/firebase';
import BottomNavBar from '../comp/BottomNavBarForEvents';
import useThemeStore from "@/comp/themeStore"; 
import { Ionicons } from "@expo/vector-icons";

// **Define Event and User Types**
interface Event {
  id: string;
  name: string;
  description: string;
  invitedUsers: string[];
}

const Events = () => {
  const router = useRouter();
  const { darkMode } = useThemeStore(); 
  const currentUser = auth.currentUser?.uid; 

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // **Fetch User's Joined Events**
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const userEvents: Event[] = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Event))
        .filter(event => event.invitedUsers.includes(currentUser));

      setEvents(userEvents);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // **Confirm Leaving Event**
  const confirmLeaveEvent = (eventId: string) => {
    setSelectedEvent(eventId);
    setLeaveModalVisible(true);
  };

  // **Leave an Event**
  const leaveEvent = async () => {
    if (!selectedEvent) return;

    try {
      const eventRef = doc(db, 'events', selectedEvent);
      await updateDoc(eventRef, { invitedUsers: arrayRemove(currentUser) });

      setLeaveModalVisible(false);
      Alert.alert('Success', 'You have left the event.');
    } catch (error) {
      console.error('Error leaving event:', error);
      Alert.alert('Error', 'Failed to leave event.');
    }
  };

  // **Toggle Between Event List and Event Creation View**
  const toggleView = () => setCreatingEvent(!creatingEvent);

  // **Create Event**
  const createEvent = async () => {
    if (!eventName.trim()) {
      Alert.alert('Error', 'Please enter an event name.');
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to create an event.');
      return;
    }

    try {
      await addDoc(collection(db, 'events'), {
        name: eventName,
        description: eventDescription || "No description provided.",
        invitedUsers: [currentUser], 
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Event created successfully!');
      setEventName('');
      setEventDescription('');
      toggleView();
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event.');
    }
  };

  // **Main Event List View**
  if (!creatingEvent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#f5f5f5" }]}>

        {/* Header with Back Button & '+' Create Event Button */}
        <View style={[styles.header, { backgroundColor: darkMode ? "#1E1E1E" : "#24786D" }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Your Study Groups</Text>
          <TouchableOpacity onPress={toggleView} style={styles.iconButton}>
            <Ionicons name="add-circle-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Loading events...</Text>
        ) : events.length > 0 ? (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.eventContainer}>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{item.name}</Text>
                  <Text style={styles.eventDescription}>{item.description}</Text>
                </View>
                <TouchableOpacity onPress={() => confirmLeaveEvent(item.id)} style={styles.leaveButton}>
                  <Ionicons name="exit-outline" size={28} color="#d9534f" />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noEventsText}>No events joined yet.</Text>
        )}

        <BottomNavBar />
      </SafeAreaView>
    );
  }

  // **Event Creation View**
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#f5f5f5" }]}>

          {/* Header */}
          <View style={[styles.header, { backgroundColor: darkMode ? "#1E1E1E" : "#24786D" }]}>
            <TouchableOpacity onPress={toggleView} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create Study Group</Text>
          </View>

          {/* Inputs */}
          <View style={styles.formContainer}>
            <TextInput 
              style={styles.input} 
              placeholder="Event Name" 
              placeholderTextColor="#aaa"
              value={eventName} 
              onChangeText={setEventName} 
            />
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Event Description" 
              placeholderTextColor="#aaa"
              value={eventDescription} 
              onChangeText={setEventDescription} 
              multiline 
            />
          </View>

          <TouchableOpacity style={styles.createButton} onPress={createEvent}>
            <Text style={styles.createButtonText}>Create Event</Text>
          </TouchableOpacity>

        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Events;

// **Styles**
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    height: 60, // Increased height for better spacing
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#24786D",
  },
  iconButton: { padding: 10 },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flex: 1,
  },
  formContainer: {
    padding: 15,
    marginTop: 5, // Added margin to move inputs down
  },
  input: {  
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  createButton: {
    backgroundColor: "#24786D",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    margin: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingText: { textAlign: "center", fontSize: 18},
  eventContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  leaveButton: { padding: 5 },
  eventContent: { flex: 1 },
  eventTitle: { fontSize: 18, fontWeight: "bold" },
  eventDescription: { fontSize: 16, marginTop: 5 },
  noEventsText: { textAlign: "center", fontSize: 18, color: "#aaa", marginTop: 20 },
});
