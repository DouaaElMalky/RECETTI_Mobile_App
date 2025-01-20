import * as AuthService from "../services/auth_service.js";

export async function login(req, res) {
  try {
    // Vérification des champs requis
    const { email, mdp } = req.body;
    if (!email || !mdp) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Authentification
    const result = await AuthService.authenticateUser(req.body);

    // Réponse réussie
    res.status(200).json({
      message: "Welcome!",
      token: result.token,
    });

  } catch (error) {
    console.error(error);

    // Gestion des erreurs spécifiques
    if (error.message === "Utilisateur non trouvé") {
      return res.status(404).json({ message: "Invalid credentials." });
    }
    if (error.message === "Mot de passe incorrect") {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // Autres erreurs
    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
}
export async function register(req, res) {
  try {
    // Vérification des champs requis
    const { nom, email, mdp, confirmPassword } = req.body;
    if (!nom || !email || !mdp || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Vérification des mots de passe
    if (mdp !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Enregistrement de l'utilisateur
    const newUser = await AuthService.register({
      nom,
      email,
      mdp,
    });

    // Réponse réussie
    res.status(201).json(newUser);

  } catch (error) {
    console.error(error);

    // Gestion des erreurs MongoDB (duplication email)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // Autres erreurs
    res.status(500).json({ message: "An error occurred. Please try again later." });
  }
}