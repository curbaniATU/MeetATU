import React, { useState } from 'react';
import { Text, SafeAreaView, TextInput, Button, StyleSheet } from 'react-native';

export default function ProfileCreationScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');  // Added missing useState
  const [major, setMajor] = useState('');  // Added missing useState
  const [classification, setClassification] = useState('');  // Added missing useState
  const [message, setMessage] = useState('');

  // Handle profile completion
  const handleProfileCompletion = () => {
    if (username === '') {
      setMessage('Please enter your preferred name.');
    } else {
      setMessage('Profile created successfully');
      // Optionally, navigate to another screen or clear the form
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Create Your Profile!</Text>

      <TextInput
        style={styles.input}
        onChangeText={text => setUsername(text)}
        value={username}
        placeholder="Enter name: "
        placeholderTextColor="#C5C5C5"
      />

      <TextInput
        style={styles.input}
        onChangeText={text => setBio(text)}
        value={bio}
        placeholder="Bio"
        placeholderTextColor="#C5C5C5"
      />

      <TextInput
        style={styles.input}
        onChangeText={text => setMajor(text)}
        value={major}
        placeholder="Major"
        placeholderTextColor="#C5C5C5"
      />

      <TextInput
        style={styles.input}
        onChangeText={text => setClassification(text)}
        value={classification}
        placeholder="Classification"
        placeholderTextColor="#C5C5C5"
      />

      <Button title="Complete Profile" onPress={handleProfileCompletion} />

      {message && <Text style={styles.message}>{message}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    marginBottom: 20,
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
});
