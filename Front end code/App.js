import React, {useState} from 'react';
import { Text, SafeAreaView, StyleSheet, TextInput, Button, View} from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const handlePress = () => {
    if (isLogin) {
      if (email=== ''|| password === '') {
        setMessage('Please fill out all fields');
        return;
      }
      setMessage('Login Successful');
    }
    else{
      if (email === ''||password ===''||firstName === '' ||lastName === ''){
        setMessage('Please fill out all fields.');
        return;
      }
      setMessage('Registration successful'); 
    }
  };
  const toggleLoginRegister = () => {
    setIsLogin(!isLogin); // using this to be able to switch back and forth 
    setMessage(''); // this will clear the message 
  };
  return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.welcome}>Welcome!</Text>
    {!isLogin && (
          <>
              <Text style={styles.textBoxHeader}>Enter your first name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setFirstName(text)}
              value={firstName}
              placeholderTextColor="#C5C5C5"
              placeholder="Enter your first name" 
            />
            <TextInput
              style={styles.input}
              onChangeText={text => setLastName(text)}
              value={lastName}
              placeholderTextColor="#C5C5C5"
              placeholder="Enter your last name" 
            />
            </>
        )}

            <TextInput
              style={styles.input}
              onChangeText={text => setEmail(text)}
              value={email}
              placeholderTextColor="#C5C5C5"
              placeholder="Enter your email" 
            />

            <TextInput
              style={styles.input}
              onChangeText={text => setPassword(text)}
              value={password}
              placeholderTextColor="#C5C5C5"
              placeholder="Enter your password"
              secureTextEntry
            />

            <Button
              style={{marginTop: 10}}
              title={isLogin ? 'Login': 'Register'}
              onPress={handlePress}
            />

            <Button
              style={{marginTop: 10}}
              title={isLogin ? 'Switch to Sign Up': 'Switch to Login'}
              onPress={toggleLoginRegister}
            />

            {message && (
              <Text style={styles.paragraph}>
                {message}
              </Text>
            )}
       
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
  },

   welcome: {
    height: 40,
    textAlign:'center',
    fontWeight: 'bold',
    marginBottom: 60,
    fontSize: 25,
  },

  paragraph: {
    margin: 24,
    fontSize: 18,
    marginBottom: 2,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  textBoxHeader: {
    margin: 15,
    fontSize: 16,
    marginBottom: 2,
    fontWeight: 'normal',
    textAlign: 'left',
  },
});
