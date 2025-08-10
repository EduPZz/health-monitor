import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AverageCard = ({ averageHours, averageMinutes, selectedDateRange }) => {
  const getAverageTitle = () => {
    switch (selectedDateRange) {
      case "week":
        return "Média Diária";
      case "month":
        return "Média Semanal";
      case "year":
        return "Média Mensal";
      default:
        return "Média Diária";
    }
  };
  const getTimeRangeText = () => {
    switch (selectedDateRange) {
      case "week":
        return "esta semana";
      case "month":
        return "este mês";
      case "year":
        return "este ano";
      default:
        return "esta semana";
    }
  };

  return (
    <View style={styles.averageCard}>
      <Text style={styles.averageTitle}>{getAverageTitle()}</Text>
      <Text style={styles.averageTime}>
        {averageHours}h {averageMinutes}m
      </Text>
      <Text style={styles.averageSubtitle}>{getTimeRangeText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  averageCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  averageTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  averageTime: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  averageSubtitle: {
    fontSize: 12,
    color: "#999",
  },
});

export default AverageCard; 