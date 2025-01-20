import UserModel from "../models/Utilisateur.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function updateUser(id, user) {
  if (user.mdp) {
    user.mdp = await bcrypt.hash(UserActivation.mdp, 10);
  }

  return await UserModel.findByIdAndUpdate(id, user, {
    new: true,
    runValidators: true,
  });
}
export async function getUserById(id) {
  const objectId = new mongoose.Types.ObjectId(id);
  return await UserModel.findById(objectId);
}
export const addFavoriteService = async (userId, recipeId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé");

  if (!user.favoris.includes(recipeId)) {
    user.favoris.push(recipeId);
    await user.save();
  }
  return user.favoris;
};

// Supprimer un favori
export const removeFavoriteService = async (userId, recetteId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé");

  user.favoris = user.favoris.filter((id) => id.toString() !== recetteId);
  await user.save();
  return user.favoris;
};

// Récupérer les favoris
export const getFavoritesService = async (userId) => {
  const user = await UserModel.findById(userId).populate("favoris");
  if (!user) throw new Error("Utilisateur non trouvé");
  return user.favoris;
};