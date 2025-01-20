import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API_KEY = ""; 

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchCategories(); 
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/food/ingredients/categories?apiKey=${API_KEY}`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories", error);
    }
  };

  const fetchIngredients = async (category) => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/food/ingredients/${category}/list?apiKey=${API_KEY}`
      );
      setIngredients(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des ingrédients", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${selectedIngredients.join(
          ","
        )}&apiKey=${API_KEY}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Erreur lors de la recherche de recettes", error);
    }
  };

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prevSelectedIngredients) => {
      if (prevSelectedIngredients.includes(ingredient)) {
        return prevSelectedIngredients.filter((item) => item !== ingredient);
      } else {
        return [...prevSelectedIngredients, ingredient];
      }
    });
  };

  const renderCategory = ({ item }) => (
    <View style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item}</Text>
      <TouchableOpacity onPress={() => fetchIngredients(item)}>
        <Text style={styles.fetchIngredients}>Fetch Ingredients</Text>
      </TouchableOpacity>
      <FlatList
        data={ingredients}
        renderItem={({ item: ingredient }) => (
          <TouchableOpacity
            style={styles.ingredientButton}
            onPress={() => toggleIngredient(ingredient.name)}
          >
            <Text
              style={[
                styles.ingredientText,
                selectedIngredients.includes(ingredient.name) &&
                  styles.selectedIngredient,
              ]}
            >
              {ingredient.name}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(ingredient) => ingredient.id.toString()}
        horizontal
      />
    </View>
  );

  const renderSearchCard = (recipe) => (
    <TouchableOpacity style={styles.recipeCard} key={recipe.id}>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{recipe.title}</Text>
      <Text style={styles.recipeTime}>{recipe.readyInMinutes} minutes</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for recipes..."
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        style={styles.categoriesList}
      />

      <FlatList
        data={results}
        renderItem={({ item }) => renderSearchCard(item)}
        keyExtractor={(item) => item.id.toString()}
        style={styles.resultsList}
        ListEmptyComponent={
          <Text style={styles.noResults}>No results found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    backgroundColor: "#FFF",
  },
  searchButton: {
    backgroundColor: "#1B5E20",
    padding: 10,
    borderRadius: 10,
  },
  categoriesList: {
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  fetchIngredients: {
    color: "#1B5E20",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  ingredientButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: "#1B5E20",
    borderRadius: 5,
  },
  ingredientText: {
    color: "#FFF",
    fontSize: 14,
  },
  selectedIngredient: {
    backgroundColor: "#FF6347", 
  },
  recipeCard: {
    flexDirection: "row",
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  recipeTime: {
    fontSize: 12,
    color: "#666",
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});

export default SearchPage;
