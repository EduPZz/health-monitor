import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const DateFilter = ({ selectedDateRange, setSelectedDateRange }) => {
  return (
    <View style={styles.dateFilterContainer}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedDateRange === "week" && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedDateRange("week")}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedDateRange === "week" && styles.filterButtonTextActive,
          ]}
        >
          Semana
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedDateRange === "month" && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedDateRange("month")}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedDateRange === "month" && styles.filterButtonTextActive,
          ]}
        >
          Mês
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.filterButton,
          selectedDateRange === "year" && styles.filterButtonActive,
        ]}
        onPress={() => setSelectedDateRange("year")}
      >
        <Text
          style={[
            styles.filterButtonText,
            selectedDateRange === "year" && styles.filterButtonTextActive,
          ]}
        >
          Ano
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  dateFilterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#1976D2",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
});

export default DateFilter; 