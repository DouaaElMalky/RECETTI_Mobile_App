const mongoose = require('mongoose');

// Schéma ingrédient
const ingredientSchema = new mongoose.Schema({
  idIngredient: {
    type: Number,
    required: true,
  },
  nom: {
    type: String,
    required: true,
  },
  categorie: {
    type: String,
  },
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
