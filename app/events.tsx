// app/events.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView, Text, StyleSheet, TextInput, FlatList, View,
  TouchableOpacity, Alert, Platform, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../comp/firebase';

// Define a simple User interface
interface User { id: string; name: string; email?: string; }

const Events = () => {
  const router = useRouter();

  // Local state for the event form
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // User search & invitation
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔥 **Fix: Real-time user search (like chat page)**
  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]);
      setShowDropdown(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const filteredUsers = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as User))
        .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()));

      setUsers(filteredUsers);
      setShowDropdown(filteredUsers.length > 0);
    });

    return () => unsubscribe();
  }, [searchQuery]);

  // ✅ **Invite Users (Limit 10)**
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

  // ✅ **Fix Event Creation**
  const createEvent = async () => {
    if (!eventName.trim()) {
      Alert.alert('Error', 'Please enter an event name.');
      return;
    }

    try {
      await addDoc(collection(db, 'events'), {
        name: eventName,
        description: eventDescription || "No description provided.",
        invitedUsers: invitedUsers.map(user => user.id),
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Event created successfully!');
      setEventName('');
      setEventDescription('');
      setInvitedUsers([]);
    } catch (error) {
      console.error('❌ Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Study Group Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Event Name"
        placeholderTextColor="#333"
        value={eventName}
        onChangeText={setEventName}
      />

      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Event Description"
        placeholderTextColor="#333"
        value={eventDescription}
        onChangeText={setEventDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.subtitle}>Invite Users</Text>
      <TextInput
        style={styles.input}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {showDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => inviteUser(item)}
              >
                <Text style={styles.dropdownItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {invitedUsers.length > 0 && (
        <View style={styles.invitedList}>
          <Text style={styles.subtitle}>Invited Users:</Text>
          {invitedUsers.map((user) => (
            <Text key={user.id} style={styles.invitedUser}>
              {user.name}
            </Text>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.createButton} onPress={createEvent}>
        <Text style={styles.createButtonText}>Create Event</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/home')}>
        <Text style={styles.backButtonText}>Back Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Events;

// 🔥 **Fixed Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight || 50 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  multiline: {
    height: 80,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 150,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  invitedList: {
    marginVertical: 10,
  },
  invitedUser: {
    fontSize: 16,
    color: '#555',
  },
  createButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#24786D',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
