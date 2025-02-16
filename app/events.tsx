import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, Text, StyleSheet, TextInput, FlatList, View,
  TouchableOpacity, Alert, Platform, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc, updateDoc, doc, onSnapshot, arrayRemove } from 'firebase/firestore';
import { db, auth } from '../comp/firebase';
import BottomNavBar from '../comp/BottomNavBarForEvents';

// Define Interfaces
interface Event {
  id: string;
  name: string;
  description: string;
  invitedUsers: string[];
}

interface User {
  id: string;
  name: string;
  email?: string;
}

const Events = () => {
  const router = useRouter();
  const currentUser = auth.currentUser?.uid; // Get logged-in user ID

  // **State for Event List**
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // **State for Event Creation Form**
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // **Fetch User's Joined Events**
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
      const userEvents = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Event))
        .filter(event => event.invitedUsers.includes(currentUser));

      setEvents(userEvents);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // **Leave an Event**
  const leaveEvent = async (eventId: string) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, { invitedUsers: arrayRemove(currentUser) });

      Alert.alert('Success', 'You have left the event.');
    } catch (error) {
      console.error('Error leaving event:', error);
      Alert.alert('Error', 'Failed to leave event.');
    }
  };

  // **Toggle Between Views**
  const toggleView = () => setCreatingEvent(!creatingEvent);

  // **Fetch Users for Search Dropdown**
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

  // **Invite Users**
  const inviteUser = (user: User) => {
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

  // **Create Event**
  // ✅ Updated Create Event Function (Automatically Adds Creator)
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
      invitedUsers: Array.from(new Set([...invitedUsers.map(user => user.id), currentUser])), // ✅ Ensure uniqueness
      createdAt: new Date(),
    });

    Alert.alert('Success', 'Event created successfully!');
    setEventName('');
    setEventDescription('');
    setInvitedUsers([]);
    toggleView();
  } catch (error) {
    console.error('Error creating event:', error);
    Alert.alert('Error', 'Failed to create event.');
  }
};

  // **Main Event List View**
  if (!creatingEvent) {
    return (
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Your Study Groups</Text>
    
          {loading ? (
            <Text>Loading events...</Text>
          ) : events.length > 0 ? (
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.eventContainer}>
                  <Text style={styles.eventTitle}>{item.name}</Text>
                  <Text style={styles.eventDescription}>{item.description}</Text>
                  <TouchableOpacity
                    onPress={() => leaveEvent(item.id)}
                    style={styles.leaveButton}
                  >
                    <Text style={styles.leaveButtonText}>Leave Group</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noEventsText}>No events joined yet.</Text>
          )}
    
          <TouchableOpacity style={styles.createButton} onPress={toggleView}>
            <Text style={styles.createButtonText}>Create a study group</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/home')}>
            <Text style={styles.backButtonText}>Go to homepage</Text>
          </TouchableOpacity>
        </SafeAreaView>
    
        {/* ✅ Navigation bar stays at the bottom */}
        <BottomNavBar />
      </View>
    );
    
  }

  // **Event Creation View**
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Study Group Event</Text>

      <TextInput style={styles.input} placeholder="Event Name" placeholderTextColor={styles.placeholderText.color} value={eventName} onChangeText={setEventName} />
      <TextInput style={[styles.input, styles.multiline]} placeholder="Event Description (location, time, topic)" placeholderTextColor={styles.placeholderText.color} value={eventDescription} onChangeText={setEventDescription} multiline />

      <Text style={styles.subtitle}>Invite Users</Text>
      <TextInput style={styles.input} placeholder="Search users..." placeholderTextColor={styles.placeholderText.color} value={searchQuery} onChangeText={setSearchQuery} />

      {showDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.dropdownItem} onPress={() => inviteUser(item)}>
                <Text style={styles.dropdownItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
  
        </View>
      
      )}

      <TouchableOpacity style={styles.createButton} onPress={createEvent}>
        <Text style={styles.createButtonText}>Create Event</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={toggleView}>
        <Text style={styles.backButtonText}>Back to Events</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default Events;

// 🔥 **Styles**
const styles = StyleSheet.create({
  content: {
    flexGrow: 1, // ✅ Pushes content to take available space
    justifyContent: 'center', // Keeps content centered if there's extra space
    paddingBottom: 20, // Adds spacing before navbar
  },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
      paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight || 50 : 20,
      marginBottom: 50,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: '#333',
    },
    eventContainer: { 
      backgroundColor: '#fff', 
      padding: 15, 
      borderRadius: 10, 
      marginBottom: 10,
    },
    subtitle: {  // ✅ Added missing subtitle style
      fontSize: 20,
      fontWeight: '600',
      marginVertical: 10,
      color: '#333',
    },
    input: {  // ✅ Added missing input style
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 8,
      marginBottom: 10,
    },
    multiline: {  // ✅ Added missing multiline style
      height: 80,
    },
    dropdown: {  // ✅ Added missing dropdown style
      backgroundColor: '#fff',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      maxHeight: 150,
      marginBottom: 10,
    },
    dropdownItem: {  // ✅ Added missing dropdownItem style
      padding: 10,
      borderBottomColor: '#eee',
      borderBottomWidth: 1,
    },
    dropdownItemText: {  // ✅ Added missing dropdownItemText style
      fontSize: 16,
      color: '#333',
    },
    backButton: {  // ✅ Added missing backButton style
      backgroundColor: '#24786D',
      paddingVertical: 10,
      borderRadius: 20,
      alignItems: 'center',
      marginTop: 10,
      marginLeft: 18,
      marginRight: 18,
    },
    backButtonText: {  // ✅ Added missing backButtonText style
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    createButton: {
      backgroundColor: '#28a745',
      paddingVertical: 10,
      borderRadius: 20,
      alignItems: 'center',
      marginVertical: 10,
      marginLeft: 18,
      marginRight: 18,
    },
    createButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    eventCard: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    eventTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    eventDescription: {
      fontSize: 16,
      color: '#555',
      marginTop: 5,
    },
    leaveButton: {
      marginTop: 10,
      backgroundColor: '#d9534f',
      paddingVertical: 10,
      borderRadius: 20,
      alignItems: 'center',
      marginLeft: 140,
      marginRight: 140,
    },
    leaveButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    noEventsText: {
      textAlign: 'center',
      fontSize: 18,
      color: '#666',
    },
    placeholderText: {
      color: '#c2c2c2',
    },
  });
  