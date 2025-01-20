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

const RegisterPage = ({ navigation }) => {
  // États des champs d'entrée
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Fonction d'inscription
  const handleRegister = async () => {
    setError(''); // Réinitialiser les erreurs

    // Validation des champs
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Envoi des données au backend
      const response = await axios.post('your-server-url/api/auth/register', {
        nom: trimmedName,
        email: trimmedEmail,
        mdp: trimmedPassword,
        confirmPassword: trimmedConfirmPassword, // Ajout de confirmPassword
      });

      // Succès
      Alert.alert('Success!', 'Account created. Please log in.');
      navigation.navigate('Login'); // Redirection vers la page Login
    } catch (err) {
      console.log(err.response?.data?.message);
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recetti</Text>
      <Text style={styles.heading}>Register</Text>
      <Text style={styles.subHeading}>Create an account to get started.</Text>

      {/* Champs d'entrée */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#A0A0A0"
        value={fullName}
        onChangeText={setFullName}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#A0A0A0"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Bouton d'inscription */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Affichage des erreurs */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Lien vers la connexion */}
      <Text style={styles.switchText}>
        Already have an account?{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Login')}
        >
          Sign In
        </Text>
      </Text>
    </View>
  );
};

// Styles inchangés
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
    marginBottom: 20,
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

export default RegisterPage;