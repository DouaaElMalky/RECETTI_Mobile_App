import * as UserService from "../services/user_service.js";

export async function updateUser(req, res) {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé." });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}
export async function getUserProfile(req, res) {
  try {
    const userId = req.user.id; 
    const user = await UserService.getUserById(userId);

    res.status(200).json({
      id: user._id,
      name: user.nom,
      email: user.email,
      favorites: user.favoris,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
}
export const addFavorite = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    // Validation des données
    if (!userId || !recipeId) {
      return res.status(400).json({ message: "Données manquantes." });
    }

    const favoris = await UserService.addFavoriteService(userId, recipeId);
    res.status(200).json({ favoris });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    // Validation des données
    if (!userId || !recipeId) {
      return res.status(400).json({ message: "Données manquantes." });
    }

    // Convertir recipeId en chaîne au cas où il ne serait pas au bon format
    const normalizedRecipeId = String(recipeId);

    const favoris = await UserService.removeFavoriteService(userId, normalizedRecipeId);
    res.status(200).json({ favoris });
  } catch (error) {
    console.error("Erreur dans removeFavorite :", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer les favoris
export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur requis." });
    }

    const favoris = await UserService.getFavoritesService(userId);
    res.status(200).json({ favoris });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};