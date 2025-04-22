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

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState<{ id: string; name: string; email: string }[]>([]);

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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]);
      setShowDropdown(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const filteredUsers = snapshot.docs
        .map((doc) => {
          const userData = doc.data();
          return {
            id: doc.id,
            name: userData.username || userData.firstName || userData.lastName || "Unknown User",
            email: userData.email || "",
          };
        })
        .filter(user => user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()));

      setUsers(filteredUsers);
      setShowDropdown(filteredUsers.length > 0);
    });

    return () => unsubscribe();
  }, [searchQuery]);

  const inviteUser = (user: { id: string; name: string; email: string }) => {
    if (invitedUsers.some(invited => invited.id === user.id)) {
      Alert.alert('User already invited');
      return;
    }
    if (invitedUsers.length >= 10) {
      Alert.alert('Invite Limit Reached', 'You can invite up to 10 users only.');
      return;
    }

    setInvitedUsers([...invitedUsers, user]);
    setSearchQuery('');
    setUsers([]);
    setShowDropdown(false);
  };

  const confirmLeaveEvent = (eventId: string) => {
    setSelectedEvent(eventId);
    setLeaveModalVisible(true);
  };

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

  const toggleView = () => setCreatingEvent(!creatingEvent);

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

  if (!creatingEvent) {
    return (
      <View style={{ flex: 1, backgroundColor: darkMode ? "#121212" : "#f5f5f5" }}>
        <SafeAreaView style={{ backgroundColor: "#24786D" }} />
        <SafeAreaView style={{ backgroundColor: darkMode ? "#1E1E1E" : "#24786D" }} />

        <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#f5f5f5" }]}>
          <View style={[styles.header, { backgroundColor: darkMode ? "#24786D" : "#24786D" }]}>
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
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: darkMode ? "#121212" : "#f5f5f5" }}>
          <SafeAreaView style={{ backgroundColor: darkMode ? "#24786D" : "#24786D" }} />
          <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? "#121212" : "#f5f5f5" }]}>

            <View style={[styles.header, { backgroundColor: darkMode ? "#24786D" : "#24786D" }]}>
              <TouchableOpacity onPress={toggleView} style={styles.iconButton}>
                <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerText}>Create Study Group</Text>
              </View>
              <Text style={{ color: "transparent", width: 40 }}>⠀</Text>
            </View>

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

              <TextInput 
                style={styles.input}
                placeholder="Search users to invite"
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {showDropdown && (
                <View style={styles.dropdown}>
                  {users.map((user) => (
                    <TouchableOpacity
                      key={user.id}
                      style={styles.dropdownItem}
                      onPress={() => inviteUser(user)}
                    >
                      <Text>{user.name} ({user.email})</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <View style={{ marginTop: 10 }}>
                {invitedUsers.map((user) => (
                  <Text key={user.id} style={{ marginBottom: 5 }}>
                    Invited: {user.name}
                  </Text>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.createButton} onPress={createEvent}>
              <Text style={styles.createButtonText}>Create Event</Text>
            </TouchableOpacity>

          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    height: 60,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#24786D",
  },
  headerTitleContainer: {
    alignItems: "center",
    marginTop: 15,
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
    marginTop: 5,
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
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: -10,
    marginBottom: 10,
    zIndex: 999,
  },
  dropdownItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
