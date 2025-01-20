import axios from "axios";

const spoonacularApiKey = "";

const fetchRecipesByIngredients = async (ingredients) => {
  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients`,
      {
        params: {
          ingredients,
          apiKey: spoonacularApiKey,
        },
      }
    );
    return response.data; // Retourne la liste des recettes
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error; // Gère l'erreur si l'API échoue
  }
};

export { fetchRecipesByIngredients };
