import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const ProfilePage = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const API_KEY = "";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert(
            "Unauthorized",
            "Token manquant. Veuillez vous reconnecter."
          );
          navigation.navigate("Login");
          return;
        }

        const response = await axios.get(
          "http://localhost:9090/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data);
        if (response.data.favorites && response.data.favorites.length > 0) {
          fetchFavoriteRecipes(response.data.favorites);
        } else {
          setFavorites([]);
          setLoadingFavorites(false);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        Alert.alert("Erreur", "Impossible de charger le profil.");
        navigation.navigate("Login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigation]);

  const fetchFavoriteRecipes = async (favoriteIds) => {
    try {
      setLoadingFavorites(true);

      const promises = favoriteIds.map((id) =>
        axios.get(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
        )
      );

      const responses = await Promise.all(promises);

      const recipes = responses.map((response) => response.data);
      setFavorites(recipes);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des recettes favorites :",
        error
      );
    } finally {
      setLoadingFavorites(false);
    }
  };

  const toggleFavorite = async (recipeId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const updatedFavorites = favorites.filter((fav) => fav.id !== recipeId);
      setFavorites(updatedFavorites);

      await axios.post(
        "your-server-url/api/users/favoris/remove",
        { userId: user.id, recipeId },
        config
      );
    } catch (error) {
      console.error("Erreur suppression favori :", error);
    }
  };

  const renderFavoriteCard = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() =>
        navigation.navigate("RecipeDetails", { recipeId: item.id })
      }
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
      <View style={styles.recipeDetails}>
        <Ionicons name="time-outline" size={14} color="#1B5E20" />
        <Text style={styles.recipeTime}>{item.readyInMinutes} minutes</Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          style={styles.favoriteButton}
        >
          <Ionicons name="heart" size={20} color="#E91E63" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#66CC66" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Erreur : Session expirée ou non autorisée.
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Se reconnecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/profile_placeholder.png")}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name || "Nom inconnu"}</Text>
          <Text style={styles.email}>{user.email || "Email inconnu"}</Text>
        </View>
      </View>

      <Text style={styles.favoritesTitle}>My Favorite Recipes :</Text>
      {loadingFavorites ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#66CC66" />
        </View>
      ) : favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteCard}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recipeList}
        />
      ) : (
        <Text style={styles.noFavoritesText}>No favorite racipes yet.</Text>
      )}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home" size={24} color="#042628" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search" size={24} color="#042628" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="heart" size={24} color="#042628" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10, // Réduction de l'espace en bas
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#042628",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10, // Alignement avec "sectionTitle" de Homepage
    color: "#042628",
  },
  recipeCard: {
    marginRight: 15,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    width: 150,
    height: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: "space-between",
  },
  recipeImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#333",
  },
  recipeDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recipeTime: {
    fontSize: 12,
    color: "#666",
  },
  favoriteButton: {
    marginLeft: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  noFavoritesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
    paddingVertical: 10,
  },
});

export default ProfilePage;