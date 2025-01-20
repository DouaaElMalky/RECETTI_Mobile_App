import UserModel from "../models/Utilisateur.js"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function authenticateUser({ email, mdp }) {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  const isMatch = await bcrypt.compare(mdp, user.mdp);
  if (!isMatch) {
    throw new Error("Mot de passe incorrect");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email }, 
    process.env.JWT_SECRET,             
    { expiresIn: "2h" }                 
  );

  return { token, user };
}

export async function register(user){
  return await UserModel.create(user);
}
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; 
  if (!token) {
    return res.status(401).json({ message: "Accès non autorisé." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé :", decoded); 

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(400).json({ message: "ID utilisateur invalide." });
    }

    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(403).json({ message: "Token invalide." });
  }
}

