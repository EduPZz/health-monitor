import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CompanionHeader = ({ companion }) => {
  const initials = companion?.name
    .split(" ")
    ?.map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.companionInfo}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <Text style={styles.companionName}>{companion.name}</Text>
      <Text style={styles.companionEmail}>{companion.email}</Text>
      <Text style={styles.companionAge}>
        {new Date().getFullYear() -
          new Date(companion.birthDate).getFullYear()}{" "}
        anos
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  companionInfo: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1976D2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  companionName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  companionEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  companionAge: {
    fontSize: 14,
    color: "#999",
  },
});

export default CompanionHeader; 