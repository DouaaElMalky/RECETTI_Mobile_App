import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const HomePage = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Breakfast");
  const [favorites, setFavorites] = useState([]);
  const [userId, setUserId] = useState(null); // Stocker l'ID utilisateur
  const [isUserInitialized, setIsUserInitialized] = useState(false);

  const API_KEY = "";
  // Ajout de la fonction pour capitaliser les titres
  const formatTitle = (title, maxLength = 40) => {
    const formattedTitle = title
      .toLowerCase()
      .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase());

    return formattedTitle.length > maxLength
      ? formattedTitle.substring(0, maxLength) + "..."
      : formattedTitle;
  };
  // Récupérer les informations utilisateur au chargement
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.error("Token manquant. L'utilisateur doit être connecté.");
          return;
        }

        const response = await axios.get(
          "your-server-url/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Données utilisateur récupérées :", response.data);
        setUserId(response.data.id); // Stocker l'ID utilisateur
        setIsUserInitialized(true);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur :",
          error
        );
      }
    };

    fetchUserData();
  }, []);

  // Charger les favoris de l'utilisateur
  const fetchFavorites = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(
        `your-server-url/api/users/favoris/${userId}`
      );
      setFavorites(response.data.favoris || []);
    } catch (error) {
      console.error("Erreur chargement des favoris :", error);
    }
  };

  // Charger les recettes par catégorie
  const fetchRecipesByCategory = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/random?number=5&tags=${category.toLowerCase()}&apiKey=${API_KEY}`
      );
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error("Erreur lors du chargement des recettes :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUserInitialized) {
      fetchFavorites();
      fetchRecipesByCategory(activeCategory);
    }
  }, [isUserInitialized, activeCategory]);

  const fetchRandomRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/random?number=5&apiKey=${API_KEY}`
      );
      setRandomRecipes(response.data.recipes);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des recettes aléatoires :",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipesByCategory(activeCategory);
    fetchRandomRecipes();
  }, [activeCategory]);

  // Ajouter/Supprimer des favoris
  const isFavorite = (recipeId) => favorites.includes(recipeId);

  const toggleFavorite = async (recipeId) => {
    if (!userId) {
      console.error("User ID non défini !");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token non disponible");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Mettre à jour l'état local avant la requête
      if (isFavorite(recipeId)) {
        setFavorites((prev) => prev.filter((id) => id !== recipeId));

        // Appeler l'API pour supprimer des favoris
        await axios.post(
          "your-server-url/api/users/favoris/remove",
          { userId, recipeId },
          config
        );
      } else {
        setFavorites((prev) => [...prev, recipeId]);

        // Appeler l'API pour ajouter aux favoris
        await axios.post(
          "your-server-url/api/users/favoris/add",
          { userId, recipeId },
          config
        );
      }
    } catch (error) {
      console.error("Erreur ajout/suppression favori :", error);
    }
  };

  const renderRecipeCard = (recipe) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() =>
        navigation.navigate("RecipeDetails", { recipeId: recipe.id })
      }
      key={recipe.id}
    >
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{formatTitle(recipe.title)}</Text>
      <View style={styles.recipeDetails}>
        <Ionicons name="time-outline" size={14} color="#1B5E20" />
        <Text style={styles.recipeTime}>{recipe.readyInMinutes} minutes</Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(recipe.id)}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite(recipe.id) ? "heart" : "heart-outline"}
            size={20}
            color={isFavorite(recipe.id) ? "#E91E63" : "#666"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>What would you like to cook today?</Text>

      <View style={styles.categories}>
        {["Breakfast", "Lunch", "Dinner", "Dessert"].map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              activeCategory === category && styles.activeCategory,
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                activeCategory === category && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>{activeCategory} Recipes</Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#66CC66" />
          <Text style={styles.loadingText}>Loading recipes...</Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={recipes}
          renderItem={({ item }) => renderRecipeCard(item)}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.recipeList}
        />
      )}

      <Text style={styles.sectionTitle}>Popular Recipes</Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#66CC66" />
          <Text style={styles.loadingText}>Loading popular recipes...</Text>
        </View>
      ) : (
        <FlatList
          horizontal
          data={randomRecipes}
          renderItem={({ item }) => renderRecipeCard(item)}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.recipeList}
        />
      )}
      {/* Menu fixe */}
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

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#EAEAEA",
  },
  activeCategory: {
    backgroundColor: "#D8F3DC",
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
  },
  activeCategoryText: {
    color: "#1B5E20",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  recipeCard: {
    marginRight: 15,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    width: 150, // Largeur fixe
    height: 220, // Hauteur réduite pour éviter l'espace blanc
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: "space-between", // Réduit les espaces internes
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  recipeTime: {
    fontSize: 12,
    color: "#666",
  },
  favoriteButton: {
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
    paddingVertical: 10,
  },
});

export default HomePage;