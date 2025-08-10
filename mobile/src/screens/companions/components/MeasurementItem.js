import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icons from "../../../components/Icons";

const MeasurementItem = ({ measurement, isHighlighted = false }) => {
  return (
    <View style={[styles.measurementCard, isHighlighted && styles.highlightedCard]}>
      <View style={styles.measurementHeader}>
        <Text style={[styles.measurementDate, isHighlighted && styles.highlightedText]}>
          {new Date(measurement.createdAt).toLocaleDateString("pt-BR")}
        </Text>
        <Text style={[styles.measurementTime, isHighlighted && styles.highlightedSubtext]}>
          {new Date(measurement.createdAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <View style={styles.measurementData}>
        {measurement.weight && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="weight-scale" size={16} color={isHighlighted ? "#4CAF50" : "#1976D2"} />
            <Text style={[styles.measurementLabel, isHighlighted && styles.highlightedSubtext]}>Peso:</Text>
            <Text style={[styles.measurementValue, isHighlighted && styles.highlightedText]}>{measurement.weight} kg</Text>
          </View>
        )}

        {measurement.height && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="ruler" size={16} color={isHighlighted ? "#4CAF50" : "#1976D2"} />
            <Text style={[styles.measurementLabel, isHighlighted && styles.highlightedSubtext]}>Altura:</Text>
            <Text style={[styles.measurementValue, isHighlighted && styles.highlightedText]}>{measurement.height} cm</Text>
          </View>
        )}

        {measurement.chestCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color={isHighlighted ? "#4CAF50" : "#1976D2"} />
            <Text style={[styles.measurementLabel, isHighlighted && styles.highlightedSubtext]}>
              Circunferência do Tórax:
            </Text>
            <Text style={[styles.measurementValue, isHighlighted && styles.highlightedText]}>
              {measurement.chestCircumference} cm
            </Text>
          </View>
        )}

        {measurement.waistCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color={isHighlighted ? "#4CAF50" : "#1976D2"} />
            <Text style={[styles.measurementLabel, isHighlighted && styles.highlightedSubtext]}>
              Circunferência da Cintura:
            </Text>
            <Text style={[styles.measurementValue, isHighlighted && styles.highlightedText]}>
              {measurement.waistCircumference} cm
            </Text>
          </View>
        )}

        {measurement.hipCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color={isHighlighted ? "#4CAF50" : "#1976D2"} />
            <Text style={[styles.measurementLabel, isHighlighted && styles.highlightedSubtext]}>
              Circunferência do Quadril:
            </Text>
            <Text style={[styles.measurementValue, isHighlighted && styles.highlightedText]}>
              {measurement.hipCircumference} cm
            </Text>
          </View>
        )}

        {measurement.leftArmCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color={isHighlighted ? "#4CAF50" : "#1976D2"} />
            <Text style={[styles.measurementLabel, isHighlighted && styles.highlightedSubtext]}>
              Circunferência do Braço Esquerdo:
            </Text>
            <Text style={[styles.measurementValue, isHighlighted && styles.highlightedText]}>
              {measurement.leftArmCircumference} cm
            </Text>
          </View>
        )}

        {measurement.rightArmCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color={isHighlighted ? "#4CAF50" : "#1976D2"} />
            <Text style={[styles.measurementLabel, isHighlighted && styles.highlightedSubtext]}>
              Circunferência do Braço Direito:
            </Text>
            <Text style={[styles.measurementValue, isHighlighted && styles.highlightedText]}>
              {measurement.rightArmCircumference} cm
            </Text>
          </View>
        )}

        {measurement.leftThighCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color={isHighlighted ? "#4CAF50" : "#1976D2"} />
            <Text style={[styles.measurementLabel, isHighlighted && styles.highlightedSubtext]}>
              Circunferência da Coxa Esquerda:
            </Text>
            <Text style={[styles.measurementValue, isHighlighted && styles.highlightedText]}>
              {measurement.leftThighCircumference} cm
            </Text>
          </View>
        )}

        {measurement.rightThighCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color={isHighlighted ? "#4CAF50" : "#1976D2"} />
            <Text style={[styles.measurementLabel, isHighlighted && styles.highlightedSubtext]}>
              Circunferência da Coxa Direita:
            </Text>
            <Text style={[styles.measurementValue, isHighlighted && styles.highlightedText]}>
              {measurement.rightThighCircumference} cm
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  measurementCard: {
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
  highlightedCard: {
    backgroundColor: "#f8fff8",
    borderWidth: 2,
    borderColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  measurementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  measurementDate: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  highlightedText: {
    color: "#2E7D32",
    fontWeight: "700",
  },
  measurementTime: {
    fontSize: 12,
    color: "#666",
  },
  highlightedSubtext: {
    color: "#4CAF50",
  },
  measurementData: {
    gap: 8,
  },
  measurementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  measurementLabel: {
    fontSize: 14,
    color: "#666",
    flex: 1,
  },
  measurementValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
});

export default MeasurementItem; 