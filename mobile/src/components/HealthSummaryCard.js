import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "./Icons";

const HealthSummaryCard = ({ data }) => {
  const getHealthScore = () => {
    let score = 0;
    let total = 0;

    if (data.latestWeight) {
      score += 25;
      total += 25;
    }

    if (data.latestMeasures) {
      score += 25;
      total += 25;
    }

    if (data.recentExercises.length >= 3) {
      score += 25;
    } else if (data.recentExercises.length > 0) {
      score += (data.recentExercises.length / 3) * 25;
    }
    total += 25;

    if (data.upcomingConsultations.length > 0) {
      score += 25;
      total += 25;
    }

    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const currentWeight = data.latestWeight ? data.latestWeight.value : null;

  const getHealthStatus = (score) => {
    if (score >= 80) return { text: "Excelente", color: "#4CAF50" };
    if (score >= 60) return { text: "Bom", color: "#8BC34A" };
    if (score >= 40) return { text: "Regular", color: "#FF9800" };
    return { text: "Precisa Melhorar", color: "#F44336" };
  };

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
            {data.latestWeight ? "Peso atualizado" : "Peso pendente"}
          </Text>
        </View>

        <View style={styles.metric}>
          <Icon.MaterialCommunityIcons
            name="tape-measure"
            size={16}
            color="#FF9800"
          />
          <Text style={styles.metricText}>
            {data.latestMeasures ? "Medidas atualizadas" : "Medidas pendentes"}
          </Text>
        </View>

        <View style={styles.metric}>
          <Icon.FontAwesome6 name="dumbbell" size={16} color="#9C27B0" />
          <Text style={styles.metricText}>
            {data.recentExercises.length} exercícios recentes
          </Text>
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
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#22313F",
    marginLeft: 12,
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
  },
  metricText: {
    fontSize: 14,
    color: "#22313F",
    marginLeft: 12,
    flex: 1,
  },
});

export default HealthSummaryCard;
