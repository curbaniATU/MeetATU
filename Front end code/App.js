import React, { useState } from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, Button, View, TouchableOpacity, Image } from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [isOnboarding, setIsOnboarding] = useState(true); // To control the onboarding page visibility

  // Helper function to check if the email ends with "@atu.edu"
  const isValidEmailDomain = (email) => {
    return email.endsWith('@atu.edu');
  };

  const handlePress = () => {
    if (email === '' || password === '') {
      setMessage('Please fill out all fields');
      return;
    }

    if (!isValidEmailDomain(email)) {
      setMessage('Email domain is forbidden');
      return;
    }

    if (isLogin) {
      setMessage('Login Successful');
    } else {
      if (firstName === '' || lastName === '') {
        setMessage('Please fill out all fields.');
        return;
      }
      setMessage('Registration successful');
    }
  };

  const toggleLoginRegister = () => {
    setIsLogin(!isLogin);
    setMessage('');
  };

  const handleOnboardingPress = () => {
    setIsOnboarding(false); // Go to login/sign up after onboarding
  };

  const handleBackPress = () => {
    setIsOnboarding(true); // Navigate back to the onboarding page
  };

  if (isOnboarding) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Logo above "Meet ATU" for onboarding page */}
        <Image
          source={{ uri: 'https://cdn.discordapp.com/attachments/1275905025104941056/1293324377370398915/68f0ee2c-9821-4d5f-8112-a5f77c50c886.png?ex=6706f5b0&is=6705a430&hm=0255f5c4ea3ba22090754ec88fad3f5ebc98dca2bb4a93c9133624d9ad7d0d2c&'/*add image location. Got this code block from GPT so if incompatible, lmk*/ }}
          style={styles.logo}
        />

        <Text style={styles.appName}>Meet ATU</Text>

        <View style={styles.buttonContainer}>
          <Button title="Sign up with Tech e-mail" onPress={handleOnboardingPress} />
        </View>

        <TouchableOpacity onPress={handleOnboardingPress}>
          <Text style={styles.loginText}>
            Existing account? <Text style={styles.loginButton}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back button with arrow at the top left */}
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Text style={styles.backButtonText}>{'<'} Back</Text>
      </TouchableOpacity>

      <Text style={styles.welcome}>Welcome!</Text>
      {!isLogin && (
        <>
          <Text style={styles.textBoxHeader}>Enter your first name:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
            placeholderTextColor="#C5C5C5"
            placeholder="Enter your first name"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setLastName(text)}
            value={lastName}
            placeholderTextColor="#C5C5C5"
            placeholder="Enter your last name"
          />
        </>
      )}

      <TextInput
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholderTextColor="#C5C5C5"
        placeholder="Enter your email"
      />

      <TextInput
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        placeholderTextColor="#C5C5C5"
        placeholder="Enter your password"
        secureTextEntry
      />

      <Button title={isLogin ? 'Login' : 'Register'} onPress={handlePress} />

      <Button title={isLogin ? 'Switch to Sign Up' : 'Switch to Login'} onPress={toggleLoginRegister} />

      {message && <Text style={styles.paragraph}>{message}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    padding: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 4,
    marginBottom: 10,
  },
  welcome: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 20,
  },
  textBoxHeader: {
    margin: 15,
    fontSize: 16,
    marginBottom: 2,
    fontWeight: 'normal',
    textAlign: 'left',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    marginBottom: 2,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  loginButton: {
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    padding: 10,
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 60,
  },
});
