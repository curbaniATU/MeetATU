import React, { useState } from 'react';
import { Text, SafeAreaView, TextInput, Button, StyleSheet } from 'react-native';

export default function ProfileCreationScreen({ navigation }) {
  const [classes, setClasses] = useState(''); // Added state for classes
  const [message, setMessage] = useState('');

  // Handle profile completion
  const handleProfileCompletion = () => {
    if (classes === '') {
      setMessage('Please enter your classes');
    } else {
      setMessage('Profile created successfully');
      // Optionally, navigate to another screen or clear the form
    }
  };

  // Handle adding a class
  const handleAddClass = () => {
    if (classes === '') {
      setMessage('Please enter a class to add.');
    } else {
      setMessage(`Class ${classes} added!`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Register your classes here!</Text>

      <TextInput
        style={styles.input}
        onChangeText={(text) => setClasses(text)} // Corrected to use the setClasses state setter
        value={classes}
        placeholder="Enter a class"
        placeholderTextColor="#C5C5C5"
      />

      <Button title="Add Class" onPress={handleAddClass} />
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
