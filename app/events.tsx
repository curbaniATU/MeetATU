// app/events.tsx
import React, { useState } from 'react';
import {SafeAreaView, Text, StyleSheet, TextInput, FlatList, View, TouchableOpacity, Alert, Platform, StatusBar,} from 'react-native';
import { useRouter } from 'expo-router';
import {collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../comp/firebase';

// Define a simple User interface (adjust based on your Firestore structure)
interface User { id: string; name: string; email?: string; }

const Events = () => {
  const router = useRouter();

  // Local state for the event form
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // Local state for user search & invitation
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Create a new event and store it in Firestore
  const createEvent = async () => {
    if (!eventName) {
      Alert.alert('Please enter an event name');
      return;
    }
    try {
      // Save the event to Firestore (assumes you have an "events" collection)
      const eventDoc = await addDoc(collection(db, 'events'), {
        name: eventName,
        description: eventDescription,
        invitedUsers: invitedUsers.map((user) => user.id),
        createdAt: new Date(),
      });
      Alert.alert('Event created!', `Event ID: ${eventDoc.id}`);

      // (Optional) Award points for creating or hosting an event.
      // updateUserPoints(currentUserId, somePointValue);

      // Clear the form after creating the event
      setEventName('');
      setEventDescription('');
      setInvitedUsers([]);
      setSearchQuery('');
      setUsers([]);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error creating event: ', error);
      Alert.alert('Error', 'Could not create event');
    }
  };

  // Search for users by name (assumes you have a "users" collection with a "name" field)
  const searchUsers = async (text: string) => {
    setSearchQuery(text);
    if (!text) {
      setUsers([]);
      setShowDropdown(false);
      return;
    }
    try {
      const usersRef = collection(db, 'users');
      // Using a range query to simulate a "starts with" search
      const q = query(
        usersRef,
        where('name', '>=', text),
        where('name', '<=', text + '\uf8ff')
      );
      const snapshot = await getDocs(q);
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersData);
      setShowDropdown(usersData.length > 0);
    } catch (error) {
      console.error('Error searching users: ', error);
      Alert.alert('Error', 'Could not search users');
    }
  };

  // Invite a user to the event (limit to 10 invites)
  const inviteUser = (user: User) => {
    if (invitedUsers.find((u) => u.id === user.id)) {
      Alert.alert('User already invited');
      return;
    }
    if (invitedUsers.length >= 10) {
      Alert.alert('Invite Limit Reached', 'You can invite up to 10 users only.');
      return;
    }
    setInvitedUsers([...invitedUsers, user]);
    // Optionally clear the search results after adding a user
    setSearchQuery('');
    setUsers([]);
    setShowDropdown(false);
  };

  // A generic function to update a user's points (for demonstration)
  const updateUserPoints = async (userId: string, points: number) => {
    try {
      const userRef = doc(db, 'players', userId);
      await updateDoc(userRef, {
        points: points,
      });
      console.log(`Awarded ${points} points to user ${userId}`);
    } catch (error) {
      console.error('Error updating user points: ', error);
    }
  };

  // Sample functions to simulate various event-based point awards

  // When a user attends a study group
  const attendStudyGroup = async (userId: string) => {
    await updateUserPoints(userId, 20);
    Alert.alert('Thanks for attending!', "You've earned 20 points.");
  };

  // When a user joins a study event (non-class)
  const joinStudyEvent = async (userId: string) => {
    await updateUserPoints(userId, 15);
    Alert.alert('Event joined!', "You've earned 15 points.");
  };

  // When a user participates in the group chat
  const contributeChatMessage = async (userId: string) => {
    await updateUserPoints(userId, 5);
    console.log("Chat contribution: 5 points awarded.");
  };

  // When a user reaches a new leaderboard rank
  const leaderboardClimbBonus = async (userId: string) => {
    await updateUserPoints(userId, 20);
    Alert.alert('Congratulations!', "You've earned a 20-point bonus for climbing the leaderboard.");
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
        placeholder="Search users by name"
        placeholderTextColor="#333"
        value={searchQuery}
        onChangeText={searchUsers}
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace('/home')}
      >
        <Text style={styles.backButtonText}>Back Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Events;

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
    marginTop: 10,
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
    marginLeft: 20,
    marginRight: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
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
    // Optional: shadow for iOS and elevation for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
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
    marginLeft: 20,
    marginRight: 20,
    marginTop: 150,
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
    marginLeft: 20,
    marginRight: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
