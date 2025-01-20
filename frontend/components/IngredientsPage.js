import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const API_KEY = "";

const IngredientsPage = ({ navigation }) => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [diet, setDiet] = useState("");
  const [intolerances, setIntolerances] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchRecipesByFilters = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch`,
        {
          params: {
            apiKey: API_KEY,
            includeIngredients: selectedIngredients.join(","),
            diet: diet,
            intolerances: intolerances,
            cuisine: cuisine,
            number: 10,
          },
        }
      );
      setRecipes(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des recettes :", error);
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/food/ingredients/autocomplete`,
          {
            params: {
              query: query,
              apiKey: API_KEY,
              number: 5,
            },
          }
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des suggestions :",
          error
        );
      }
    } else {
      setSuggestions([]);
    }
  };

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleSearch = (text) => {
    setSearchText(text);
    fetchSuggestions(text);
  };

  const handleAddIngredient = (ingredient) => {
    if (ingredient && !selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
      setSearchText("");
      setSuggestions([]);
    }
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => {
        console.log("Recipe ID:", item.id);
        navigation.navigate("RecipeDetails", { recipeId: item.id });
      }}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <Text style={styles.recipeTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const applyFilters = () => {
    setFilterVisible(false);
    fetchRecipesByFilters();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recipes by Ingredients</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.ingredientsContainer}>
          <Text style={styles.sectionTitle}>Selected Ingredients</Text>
          <View style={styles.selectedIngredients}>
            {selectedIngredients.map((ingredient, index) => (
              <TouchableOpacity
                key={index}
                style={styles.ingredientChip}
                onPress={() => toggleIngredient(ingredient)}
              >
                <Text style={styles.ingredientChipText}>{ingredient}</Text>
                <Ionicons name="close" size={16} color="#FFF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Add an ingredient (e.g., tomato)"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={handleSearch}
            onSubmitEditing={(event) => {
              const newIngredient = event.nativeEvent.text.trim();
              handleAddIngredient(newIngredient);
            }}
          />
          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleAddIngredient(item.name)}
                >
                  <Text style={styles.suggestionText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={fetchRecipesByFilters}
          disabled={selectedIngredients.length === 0}
        >
          <Text style={styles.searchButtonText}>Find Recipes</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1B5E20" />
            <Text style={styles.loadingText}>Loading recipes...</Text>
          </View>
        ) : (
          <FlatList
            data={recipes}
            renderItem={renderRecipe}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={
              <Text style={styles.noResults}>No recipes found.</Text>
            }
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      <Modal
        visible={filterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Diet</Text>
              <Picker
                selectedValue={diet}
                style={styles.picker}
                onValueChange={(itemValue) => setDiet(itemValue)}
              >
                <Picker.Item label="Select Diet" value="" />
                <Picker.Item label="Vegetarian" value="vegetarian" />
                <Picker.Item label="Vegan" value="vegan" />
                <Picker.Item label="Gluten Free" value="gluten free" />
                <Picker.Item label="Ketogenic" value="ketogenic" />
              </Picker>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Intolerances</Text>
              <Picker
                selectedValue={intolerances}
                style={styles.picker}
                onValueChange={(itemValue) => setIntolerances(itemValue)}
              >
                <Picker.Item label="Select Intolerance" value="" />
                <Picker.Item label="Dairy" value="dairy" />
                <Picker.Item label="Egg" value="egg" />
                <Picker.Item label="Gluten" value="gluten" />
                <Picker.Item label="Peanut" value="peanut" />
              </Picker>
            </View>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Cuisine</Text>
              <Picker
                selectedValue={cuisine}
                style={styles.picker}
                onValueChange={(itemValue) => setCuisine(itemValue)}
              >
                <Picker.Item label="Select Cuisine" value="" />
                <Picker.Item label="Italian" value="italian" />
                <Picker.Item label="Asian" value="asian" />
                <Picker.Item label="Mediterranean" value="mediterranean" />
                <Picker.Item label="American" value="american" />
              </Picker>
            </View>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  ingredientsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  selectedIngredients: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ingredientChip: {
    backgroundColor: "#1B5E20",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  ingredientChipText: {
    color: "#FFF",
    fontSize: 14,
    marginRight: 5,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
  suggestionsContainer: {
    marginTop: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#1B5E20",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  recipeCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 10,
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  applyButton: {
    backgroundColor: "#1B5E20",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default IngredientsPage;