import React, { useState } from 'react';
import { Text, SafeAreaView, TextInput, Button, StyleSheet, View, Image, TouchableOpacity } from 'react-native';

export default function ProfileCreationScreen({ navigation }) {
  const [event, setEvent] = useState('');
  const [message, setMessage] = useState('');

  // Handle event addition
  const handleProfileCompletion = () => {
    if (event === '') {
      setMessage("Please enter an event");
    } else {
      setMessage('Event added successfully');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Home</Text>
      </View>

      {/* Input field and buttons */}
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEvent(text)}
          value={event}
          placeholder="Event: "
          placeholderTextColor="#C5C5C5"
        />

        <View style={styles.buttonContainer}>
          <Button title="Add Event" onPress={handleProfileCompletion} />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button title="Done" onPress={handleProfileCompletion} />
        </View>

        {message && <Text style={styles.message}>{message}</Text>}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        {/* Home */}
        <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('Home')}>
          <Image
            source={require('./assets/home.png')}
            style={styles.logo}
          />
          <Text style={styles.navItem}>Home</Text>
        </TouchableOpacity>

        {/* Messages */}
        <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('Messages')}>
          <Image
            source={require('./assets/messages.png')}
            style={styles.logo}
          />
          <Text style={styles.navItem}>Messages</Text>
        </TouchableOpacity>

        {/* Contacts */}
        <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('Contacts')}>
          <Image
            source={require('./assets/contacts.png')}
            style={styles.logo}
          />
          <Text style={styles.navItem}>Contacts</Text>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity style={styles.navItemContainer} onPress={() => navigation.navigate('Settings')}>
          <Image
            source={require('./assets/settings.png')}
            style={styles.logo}
          />
          <Text style={styles.navItem}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    paddingLeft: 8,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  buttonContainer: {
    marginBottom: 15,
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'green',
  },
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'gray',
    backgroundColor: '#f9f9f9',
  },
  navItemContainer: {
    alignItems: 'center',
  },
  navItem: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  logo: {
    width: 30,
    height: 30,
  },
});

