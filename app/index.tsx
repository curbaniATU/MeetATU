import React from 'react';
import { SafeAreaView, Text, Button, Image, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter()

  return (
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