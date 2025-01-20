import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Logout = () => {
  const [message, setMessage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    // Supprimez les éléments du stockage local
    const logout = async () => {
      await AsyncStorage.removeItem("token");
      setMessage("You are disconnected.");

      // Redirection après 1 seconde
      setTimeout(() => {
        navigation.navigate("Welcome"); // Remplacez "Home" par la page de destination
      }, 1000);
    };

    logout();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Disconnect</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  box: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});

export default Logout;
