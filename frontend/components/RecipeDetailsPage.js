import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// API KEY
const API_KEY = "";

const RecipeDetailsPage = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState(null);

  // Charger les détails de la recette
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
        );
        setRecipe(response.data);

        // Vérifiez si cette recette est un favori
        const token = await AsyncStorage.getItem("token");
        const profileResponse = await axios.get(
          "your-server-url/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserId(profileResponse.data.id);
        setIsFavorite(profileResponse.data.favorites.includes(recipeId));
      } catch (error) {
        console.error("Erreur de chargement :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeDetails();
  }, []);

  // Gérer l'ajout/suppression des favoris
  const toggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isFavorite) {
        // Supprimer des favoris
        await axios.post(
          "your-server-url/api/users/favoris/remove",
          { userId, recipeId },
          config
        );
        setIsFavorite(false);
      } else {
        // Ajouter aux favoris
        await axios.post(
          "your-server-url/api/users/favoris/add",
          { userId, recipeId },
          config
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des favoris :", error);
    }
  };

  // Pendant le chargement
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1B5E20" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // En cas d'erreur
  if (!recipe) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>Aucune recette trouvée.</Text>
      </View>
    );
  }

  // Affichage des détails
  return (
    <SafeAreaView style={styles.container}>
      {/* Défilement vertical */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Image */}
        <Image source={{ uri: recipe.image }} style={styles.recipeImage} />

        {/* Titre */}
        <View style={styles.headerContainer}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>

          {/* Bouton Favoris */}
          <TouchableOpacity
            onPress={toggleFavorite}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#E91E63" : "#666"}
            />
          </TouchableOpacity>
        </View>

        {/* Informations */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <Ionicons name="time-outline" size={16} color="#1B5E20" />{" "}
            {recipe.readyInMinutes} min
          </Text>
          <Text style={styles.infoText}>
            <Ionicons name="restaurant-outline" size={16} color="#1B5E20" />{" "}
            {recipe.servings} servings
          </Text>
        </View>

        {/* Ingrédients */}
        <Text style={styles.sectionTitle}>Ingrédients</Text>
        {recipe.extendedIngredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientText}>
            • {ingredient.original}
          </Text>
        ))}

        {/* Instructions */}
        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.instructionsText}>
          {recipe.instructions.replace(/<[^>]*>?/gm, "") ||
            "Aucune instruction disponible."}
        </Text>

        {/* Lien vers tutoriel */}
        {recipe.sourceUrl && (
          <TouchableOpacity
            style={styles.tutorialButton}
            onPress={() => Linking.openURL(recipe.sourceUrl)}
          >
            <Text style={styles.tutorialButtonText}>For more details click here !</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 20, // Ajout d'espace en bas pour éviter de couper le contenu
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
  errorText: {
    fontSize: 16,
    color: "red",
  },
  recipeImage: {
    width: "100%",
    height: 220,
    borderRadius: 15,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#042628",
    flex: 1,
  },
  favoriteButton: {
    padding: 10,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#1B5E20",
    marginRight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#042628",
  },
  ingredientText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#333",
    marginBottom: 20,
  },
  tutorialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B5E20",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  tutorialButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 10,
  },
});

export default RecipeDetailsPage;