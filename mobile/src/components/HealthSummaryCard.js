import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "./Icons";

const HealthSummaryCard = ({ data }) => {
  const getHeightMeters = (measures) => {
    if (!measures) return null;
    const possible = [
      measures.heightMeters,
      measures.height_m,
      measures.height,
      measures.heightCm,
      measures.stature,
      measures.statureCm,
    ].filter((v) => v !== undefined && v !== null)[0];
    if (possible === undefined || possible === null) return null;
    const value = Number(possible);
    if (Number.isNaN(value) || value <= 0) return null;
    if (value > 3) return value / 100; // assume cm
    return value; // already meters
  };

  const getBMI = () => {
    const weightKg = data?.latestWeight?.weight ?? null;
    const heightM = getHeightMeters(data?.latestMeasures);
    if (!weightKg || !heightM) return null;
    return weightKg / (heightM * heightM);
  };

  const getBMIScore = () => {
    const bmi = getBMI();
    if (bmi === null) return { score: 0, label: "IMC indisponível" };
    if (bmi >= 18.5 && bmi < 25) return { score: 70, label: "IMC normal" };
    if ((bmi >= 17 && bmi < 18.5) || (bmi >= 25 && bmi < 30))
      return { score: 50, label: "IMC moderado" };
    if ((bmi >= 16 && bmi < 17) || (bmi >= 30 && bmi < 35))
      return { score: 30, label: "IMC fora do ideal" };
    return { score: 10, label: "IMC de risco" };
  };

  const getExerciseScore = () => {
    const count = data?.recentExercises?.length ?? 0;
    if (count >= 5)
      return { score: 30, label: `${count} exercícios na semana` };
    if (count >= 3)
      return { score: 20, label: `${count} exercícios na semana` };
    if (count >= 1)
      return { score: 10, label: `${count} exercício(s) recente(s)` };
    return { score: 0, label: "Sem exercícios recentes" };
  };

  const getHealthScore = () => {
    // Score = BMI (70) + Exercises (30)
    const bmiPart = getBMIScore().score;
    const exercisePart = getExerciseScore().score;
    const total = bmiPart + exercisePart;
    return Math.max(0, Math.min(100, Math.round(total)));
  };

  const currentWeight = data?.latestWeight?.weight ?? null;

  const getHealthStatus = (score) => {
    if (score >= 80) return { text: "Excelente", color: "#4CAF50" };
    if (score >= 60) return { text: "Bom", color: "#8BC34A" };
    if (score >= 40) return { text: "Regular", color: "#FF9800" };
    return { text: "Precisa Melhorar", color: "#F44336" };
  };

  const bmi = getBMI();
  const bmiInfo = getBMIScore();
  const exerciseInfo = getExerciseScore();
  const healthScore = getHealthScore();
  const healthStatus = getHealthStatus(healthScore);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon.FontAwesome6 name="heart-pulse" size={24} color="#176B87" />
        <Text style={styles.title}>Resumo de Saúde</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={[styles.statusText, { color: healthStatus.color }]}>
          {healthStatus.text}
        </Text>
        <Text style={styles.statusSubtitle}>Status atual</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{healthScore}</Text>
          <Text style={styles.scoreLabel}>pontos</Text>
        </View>
      </View>

      <View style={styles.metricsContainer}>
        <View style={styles.metric}>
          <Icon.FontAwesome6 name="weight-scale" size={16} color="#4CAF50" />
          <Text style={styles.metricText}>
            {currentWeight ? `Peso: ${currentWeight} kg` : "Peso pendente"}
          </Text>
        </View>

        <View style={styles.metric}>
          <Icon.MaterialCommunityIcons
            name="tape-measure"
            size={16}
            color="#FF9800"
          />
          <Text style={styles.metricText}>
            {bmi !== null
              ? `IMC: ${bmi.toFixed(1)} (${bmiInfo.label})`
              : "IMC indisponível"}
          </Text>
        </View>

        <View style={styles.metric}>
          <Icon.FontAwesome6 name="dumbbell" size={16} color="#9C27B0" />
          <Text style={styles.metricText}>{exerciseInfo.label}</Text>
        </View>

        <View style={styles.metric}>
          <Icon.FontAwesome6 name="user-doctor" size={16} color="#2196F3" />
          <Text style={styles.metricText}>
            {data.upcomingConsultations.length} consultas agendadas
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginVertical: 8,
    shadowColor: "#22313F",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#22313F",
  },
  scoreContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#176B87",
  },
  scoreLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: -4,
  },
  statusContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  metricsContainer: {
    gap: 12,
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metricText: {
    fontSize: 14,
    color: "#22313F",
    flex: 1,
  },
});

export default HealthSummaryCard;
