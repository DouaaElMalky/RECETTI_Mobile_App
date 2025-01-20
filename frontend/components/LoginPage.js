import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import d'AsyncStorage

const LoginPage = ({ navigation }) => {
  // États pour gérer les champs et les erreurs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // État pour gérer les erreurs

  // Fonction de connexion
  const handleLogin = async () => {
    setError(''); // Réinitialiser les erreurs

    // Validation des champs
    if (!email || !password) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(' your-server-url/api/auth/login', {
        email,
        mdp: password, // Assurez-vous que le backend attend 'mdp'
      });

      // Stocker le token dans AsyncStorage
      const { token } = response.data; // Récupérer le token
      await AsyncStorage.setItem('token', token); // Stockage du token sécurisé
      console.log(token);
      // Message de succès et redirection vers Home
      Alert.alert('Success!', `Welcome back!`);
      navigation.navigate('Home'); // Navigation après connexion réussie
    } catch (error) {
      console.log(error.response?.data?.message);
      setError(error.response?.data?.message || 'Login failed. Try again.');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetti</Text>
      <Text style={styles.heading}>Login</Text>
      <Text style={styles.subHeading}>Please sign in to continue.</Text>

      {/* Champs d'entrée */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A0A0A0"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A0A0A0"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Bouton de connexion */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Affichage des erreurs en bas */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Lien vers l'inscription */}
      <Text style={styles.switchText}>
        Don't have an account?{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Register')}
        >
          Sign up
        </Text>
      </Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 40,
    fontFamily: 'Rochester_400Regular',
    textAlign: 'center',
    marginBottom: 30,
    color: '#042628',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#042628',
  },
  subHeading: {
    marginBottom: 20,
    color: '#6b6b6b',
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    marginBottom: 15,
    color: '#333333',
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#042628',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  switchText: {
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    color: '#042628',
    fontWeight: 'bold',
  },
  error: {
    marginTop: 15,
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    padding: 5,
    borderRadius: 5,
  },
});

export default LoginPage;