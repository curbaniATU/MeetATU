
import React from 'react';
import { SafeAreaView, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/OurLogo.png')} // Make sure the path is correct
        style={styles.logo}
      />
      <Text style={styles.appName}>Meet ATU</Text>
      <Button title="Sign up with Tech e-mail" onPress={() => navigation.navigate('SignUp')} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Existing account? <Text style={styles.loginButton}>Log in</Text>
        </Text>
      </TouchableOpacity>
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
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 60,
  },
  loginText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  loginButton: {
    fontWeight: 'bold',
  },
});
