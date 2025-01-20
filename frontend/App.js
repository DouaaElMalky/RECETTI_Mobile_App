import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useFonts, Rochester_400Regular } from "@expo-google-fonts/rochester";

import HomePage from "./components/HomePage";
import WelcomePage from "./components/WelcomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProfilePage from "./components/ProfilePage";
import RecipeDetailsPage from "./components/RecipeDetailsPage";
import IngredientsPage from "./components/IngredientsPage";
const Stack = createStackNavigator();

const App = () => {
  // État pour gérer la connexion et les informations utilisateur
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);
  const [fontsLoaded] = useFonts({
    Rochester_400Regular,
  });

  // Vérifie la session utilisateur et récupère les informations utilisateur
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (token) {
        try {
          const response = await fetch("your-server-url/api/users/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error("Erreur lors de la récupération des informations utilisateur :", error);
        }
      }
    };
    checkLoginStatus();
  }, []);

  // Affiche un écran de chargement temporaire
  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#66CC66" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Welcome" : "Welcome"}>
        {/* Page de Bienvenue */}
        <Stack.Screen
          name="Welcome"
          component={WelcomePage}
          options={{ headerShown: false }}
        />

        {/* Page de Connexion */}
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />

        {/* Page d'Inscription */}
        <Stack.Screen
          name="Register"
          component={RegisterPage}
          options={{ headerShown: false }}
        />

        {/* Page d'Accueil */}
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={({ navigation }) => ({
            headerTitle: () => <Text style={styles.headerTitle}>Recetti</Text>,
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                <TouchableOpacity
                  style={styles.profileIcon}
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Ionicons name="person-circle-outline" size={30} color="#042628" />
                </TouchableOpacity>
              </View>
            ),
            headerStyle: {
              backgroundColor: "#F8F8F8",
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleAlign: "center",
          })}
        />

        {/* Page des Détails de la Recette */}
        <Stack.Screen
          name="RecipeDetails"
          component={RecipeDetailsPage}
          options={({ navigation }) => ({
            headerTitle: () => <Text style={styles.headerTitle}>Recetti</Text>,
            headerRight: () => (
              <View style={styles.headerRightContainer}>
                <TouchableOpacity
                  style={styles.profileIcon}
                  onPress={() => navigation.navigate("Profile")}
                >
                  <Ionicons name="person-circle-outline" size={30} color="#042628" />
                </TouchableOpacity>
              </View>
            ),
            headerStyle: {
              backgroundColor: "#F8F8F8",
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleAlign: "center",
          })}
        />

        {/* Page de Profil */}
        <Stack.Screen
          name="Profile"
          component={ProfilePage}
          options={({ navigation }) => ({
            headerTitle: () => <Text style={styles.headerTitle}>Recetti</Text>,
            headerLeft: () => (
              <TouchableOpacity
                style={styles.backIcon}
                onPress={() => navigation.navigate("Home")}
              >
                <Ionicons name="arrow-back" size={24} color="#042628" />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                style={styles.logoutIcon}
                onPress={async () => {
                  // Déconnexion
                  await AsyncStorage.removeItem("token");
                  navigation.navigate("Login");
                }}
              >
                <Ionicons name="log-out-outline" size={24} color="#042628" />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: "#F8F8F8",
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleAlign: "center",
          })}
        />
        <Stack.Screen name="Search" component={IngredientsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Styles
const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontFamily: "Rochester_400Regular",
    color: "#042628",
  },
  headerRightContainer: {
    flexDirection: "row", // Aligne le texte et l'icône en ligne
    alignItems: "center", // Centre verticalement
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: "#042628",
    marginRight: 5, // Espace entre le texte et l'icône
  },
  profileIcon: {
    marginLeft: 5,
  },
  backIcon: {
    marginLeft: 20,
  },
  logoutIcon: {
    marginRight: 20,
  },
});

export default App;