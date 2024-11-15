import React from 'react';
import { SafeAreaView, Text, Button, Image, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient'; 

export default function OnboardingScreen() {
  const router = useRouter()
  
  return (
    <LinearGradient
      colors={['#EEC729', '#3EA325', 'black']} // Gradient colors
      start={{ x: 1, y: 0 }} // Starting from top-right
      end={{ x: 0, y: 0.5 }} // Ending at middle-left
      style={styles.container} // Apply gradient to the container
    >
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.appName}>Welcome!</Text>
      <Button title="Sign up with Tech e-mail" onPress={() => router.push('/signup')} />
      <Link href="/login" style={styles.loginButton}>
        <Text style={styles.loginText}>
          Existing account? <Text style={styles.loginButton}>Log in</Text>
        </Text>
      </Link>

    </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: 'gold',
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
    color: 'green',
    paddingTop: 13,
  },
});