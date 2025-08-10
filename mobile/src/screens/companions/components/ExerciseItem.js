import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icons from "../../../components/Icons";

const ExerciseItem = ({ exercise }) => {
  const duration = Math.round(
    (new Date(exercise.endTime) - new Date(exercise.beginTime)) / (1000 * 60)
  );

  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseDate}>
          {new Date(exercise.beginTime).toLocaleDateString("pt-BR")}
        </Text>
        <Text style={styles.exerciseTime}>
          {new Date(exercise.beginTime).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          -{" "}
          {new Date(exercise.endTime).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <View style={styles.exerciseData}>
        <View style={styles.exerciseItem}>
          <Icons.FontAwesome6 name="dumbbell" size={16} color="#4CAF50" />
          <Text style={styles.exerciseLabel}>Tipo:</Text>
          <Text style={styles.exerciseValue}>{exercise.type}</Text>
        </View>

        <View style={styles.exerciseItem}>
          <Icons.FontAwesome6 name="clock" size={16} color="#4CAF50" />
          <Text style={styles.exerciseLabel}>Duração:</Text>
          <Text style={styles.exerciseValue}>{duration} min</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  exerciseDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  exerciseTime: {
    fontSize: 12,
    color: "#666",
  },
  exerciseData: {
    gap: 8,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  exerciseLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  exerciseValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});

export default ExerciseItem; 