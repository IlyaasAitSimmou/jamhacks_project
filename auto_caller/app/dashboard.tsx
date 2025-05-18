import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { useAccountContext } from "./components/AccountContext";

const Dashboard = () => {
  const { user } = useAccountContext();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={['#000428', '#004e92']} style={StyleSheet.absoluteFill} />
      <BlurView intensity={20} tint="dark" style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome, {user?.username}!</Text>
          <Text style={styles.subtitle}>
            Say "Hey Bob" to ask a question to your AI assistant
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.credentialText}>Email: {user?.email}</Text>
          <Text style={styles.credentialText}>User ID: {user?.id}</Text>
          {/* Add more credentials if needed */}
        </View>
      </BlurView>
    </View>
  );
};

export default Dashboard;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    width: width * 0.85,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 44,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "Verdana", // a stylish font example
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Verdana", // a stylish font example
  },
  credentialText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginVertical: 5,
    fontFamily: "Verdana", // a stylish font example
  },
});