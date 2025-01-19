import React from 'react';
import { SafeAreaView, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';


export default function OnboardingScreen() {
  const router = useRouter()
  
  return (
    <LinearGradient
      colors={['#EEC729', '#3EA325', 'black']} // Gradient colors
      start={{ x: 1, y: 0 }} // Starting from top-right
      end={{ x: -0.55, y: 0.5 }} // Ending at middle-left
      style={styles.container} // Apply gradient to the container
    >
   
      <SafeAreaView style={styles.container}>
        <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}/>
     
        <TouchableOpacity
          style={styles.blackButton}
          onPress={() => router.push('/signup')}>

            <Text style={styles.blackButtonText}>Sign up with Tech e-mail</Text>
        </TouchableOpacity>

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

  logo: {
    width: 350,
    height: 350,
    alignSelf: 'center',
    resizeMode: 'contain', 
    marginBottom: 100,
  },
  loginText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    color:'white',
  },
  loginButton: {
    fontWeight: 'bold',
    marginTop: 20,
    color:'white',
    textAlign: 'center',

  },
  blackButton: {
    backgroundColor: 'black', 
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20, 
  },
  blackButtonText: {
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold', 
    textAlign: 'center', 
  },
});