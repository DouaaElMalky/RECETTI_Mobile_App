import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AppLoading from "expo-app-loading";
import { useFonts, Rochester_400Regular } from "@expo-google-fonts/rochester";

const WelcomePage = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Rochester_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <ImageBackground
      source={require("../assets/food_illustration.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Recetti</Text>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.secondaryButtonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    marginTop: 100,
  },
  title: {
    fontSize: 50,
    fontFamily: "Rochester_400Regular",
    color: "#042628", // Couleur principale
    marginBottom: 20,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: "#042628",
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#042628",
  },
  secondaryButtonText: {
    color: "#042628",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WelcomePage;