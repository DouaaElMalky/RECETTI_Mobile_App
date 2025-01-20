const mongoose = require('mongoose');

// Schéma recette
const recetteSchema = new mongoose.Schema({
  idRecette: {
    type: Number, // ID externe (Spoonacular)
    required: true,
  },
  titre: {
    type: String,
    required: true,
  },
  tempsCuisson: {
    type: Number,
    required: true,
  },
  difficulte: {
    type: String,
  },
  typeCuisine: {
    type: String,
  },
  popularite: {
    type: Number,
  },
  instructions: {
    type: [String],
  },
  ingredientsRecette: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient', // Référence au modèle Ingredient
    },
  ],
  image: {
    type: String,
  },
});

// Méthode pour afficher les détails d'une recette
recetteSchema.methods.afficherDetails = function () {
  return {
    idRecette: this.idRecette,
    titre: this.titre,
    tempsCuisson: this.tempsCuisson,
    difficulte: this.difficulte,
    instructions: this.instructions,
    image: this.image,
  };
};

module.exports = mongoose.model('Recette', recetteSchema);
