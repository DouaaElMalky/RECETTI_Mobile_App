import express from "express";
import * as UserController from "../controllers/user_controller.js";
const router = express.Router();
import { authMiddleware } from "../services/auth_service.js";

router.get("/profile", authMiddleware, UserController.getUserProfile);

router.post("/favoris/add", authMiddleware, UserController.addFavorite); // Ajouter un favori
router.post("/favoris/remove", UserController.removeFavorite); // Supprimer un favori
router.get("/favoris/:userId", UserController.getFavorites); // Récupérer les favoris
router.put("/:id", authMiddleware, UserController.updateUser); 

export default router;