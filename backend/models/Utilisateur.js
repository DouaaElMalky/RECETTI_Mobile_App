import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Adresse email invalide."],
  },
 mdp: {
    type: String,
    required: true,
  },
  favoris: [
    {
      type: String,
      
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("mdp")) return next();
  this.mdp = await bcrypt.hash(this.mdp, 10);
  next();
});
const UserModel=mongoose.model("User",userSchema);
export default UserModel;