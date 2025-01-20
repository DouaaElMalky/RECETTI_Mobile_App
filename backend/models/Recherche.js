const mongoose = require('mongoose');

// Schéma recherche
const rechercheSchema = new mongoose.Schema({
  ingredientsSelectionnes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
    },
  ],
  correspondanceIngredients: {
    type: String,
  },
  popularite: {
    type: Number,
  },
  niveauDifficulte: {
    type: String,
  },
  typeCuisine: {
    type: String,
  },
});


module.exports = mongoose.model('Recherche', rechercheSchema);
