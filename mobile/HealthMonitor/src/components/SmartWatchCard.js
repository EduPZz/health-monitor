import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icons from '../components/Icons';

const HealthCard = ({ value, unit, label, icon, color, description }) => (
  <View style={[styles.card, { borderColor: color }]}>
    <View style={styles.valueContainer}>
      <Text style={styles.value}>
        {value} <Text style={styles.unit}>{unit}</Text>
      </Text>
      <View style={styles.iconContainer}>{icon}</View>
    </View>
    <Text style={[styles.status, { backgroundColor: color }]}>{description}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const SmartwatchCards = ({ smartwatch }) => {
  const getBloodGlucoseStatus = (value) => {
    if (value < 70) return "Baixo";
    if (value > 140) return "Alto";
    return "Normal";
  };

  const getHeartbeatStatus = (value) => {
    if (value < 60) return "Baixo";
    if (value > 100) return "Alto";
    return "Normal";
  };

  const getBloodPressureStatus = (systolic, diastolic) => {
    if (systolic < 90 || diastolic < 60) return "Baixo";
    if (systolic > 120 || diastolic > 80) return "Alto";
    return "Normal";
  };

  return (
    <View>
      <HealthCard
        value={smartwatch.bloodGlucose}
        unit="mg / dL"
        label="Glicemia"
        color="#F9CC8A"
        description={getBloodGlucoseStatus(smartwatch.bloodGlucose)}
        icon={<Icons.MaterialCommunityIcons name="water" size={24} color="#F9CC8A" />}
      />
      <HealthCard
        value={smartwatch.heartbeat}
        unit="bpm"
        label="Batimento cardíaco"
        color="#F9A8A8"
        description={getHeartbeatStatus(smartwatch.heartbeat)}
        icon={<Icons.MaterialCommunityIcons name="heart-pulse" size={24} color="#F9A8A8" />}
      />
      <HealthCard
        value={`${smartwatch.systolic}/${smartwatch.diastolic}`}
        unit="mmHg"
        label="Pressão do sangue"
        color="#A8DDF9"
        description={getBloodPressureStatus(smartwatch.systolic, smartwatch.diastolic)}
        icon={<Icons.MaterialCommunityIcons name="water-pump" size={24} color="#A8DDF9" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
  },
  unit: {
    fontSize: 16,
    color: "#A5A5A5",
  },
  status: {
    marginTop: 4,
    fontSize: 14,
    color: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  label: {
    fontSize: 16,
    color: "#A5A5A5",
    marginTop: 8,
  },
  graph: {
    height: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  iconContainer: {
    marginLeft: 8,
  },
});

export default SmartwatchCards;
