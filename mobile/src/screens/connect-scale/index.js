import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import styles from "./styles";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const ConnectScale = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [weight, setWeight] = useState(0);
  const [metrics, setMetrics] = useState(null);

  const goBack = () => navigation.goBack();

  useEffect(() => {
    const interval = setInterval(() => {
      setWeight((prev) => {
        const next = prev + 1;
        if (next >= 10) {
          clearInterval(interval);
          setStep(2);
          setMetrics({
            fatPercentage: 22.1,
            waterPercentage: 55.3,
            muscleMass: 48.2,
            boneMass: 3.4,
            visceralFat: 8,
            bmi: 23.5,
            bmr: 1500,
            idealWeight: 70.0,
            proteinPercentage: 16.5,
            metabolicAge: 28,
            bodyType: 2,
          });
        }
        return next;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout goBackFunction={goBack} title={"Conectar dispositivo"}>
      <View style={styles.container}>
        {step === 1 && (
          <View style={localStyles.centered}>
            <Text style={localStyles.text}>⚖️ Pise na balança para iniciar o emparelhamento</Text>
            <AnimatedCircularProgress
              size={200}
              width={15}
              fill={weight * 10}
              tintColor="#FFA500"
              backgroundColor="#eee"
              rotation={0}
              lineCap="round"
            >
              {(fill) => (
                <Text style={localStyles.weightText}>{weight} kg</Text>
              )}
            </AnimatedCircularProgress>
          </View>
        )}

        {step === 2 && metrics && (
          <ScrollView contentContainerStyle={localStyles.scroll}>
            <Text style={localStyles.sectionTitle}>🧍 Composição corporal</Text>
            <MetricCard label="Gordura" value={`${metrics.fatPercentage}%`} emoji="🔥" />
            <MetricCard label="Água" value={`${metrics.waterPercentage}%`} emoji="💧" />
            <MetricCard label="Proteína" value={`${metrics.proteinPercentage}%`} emoji="🥚" />
            <MetricCard label="Tipo corporal" value={metrics.bodyType} emoji="🧍" />

            <Text style={localStyles.sectionTitle}>💪 Massa e estrutura</Text>
            <MetricCard label="Massa muscular" value={`${metrics.muscleMass} kg`} emoji="💪" />
            <MetricCard label="Massa óssea" value={`${metrics.boneMass} kg`} emoji="🦴" />
            <MetricCard label="Gordura visceral" value={metrics.visceralFat} emoji="🍔" />

            <Text style={localStyles.sectionTitle}>⚙️ Metabolismo e saúde</Text>
            <MetricCard label="IMC" value={metrics.bmi} emoji="📊" />
            <MetricCard label="Idade metabólica" value={`${metrics.metabolicAge} anos`} emoji="🧠" />
            <MetricCard label="Taxa metabólica basal" value={`${metrics.bmr} kcal`} emoji="⚡️" />
            <MetricCard label="Peso ideal" value={`${metrics.idealWeight} kg`} emoji="🎯" />
          </ScrollView>
        )}
      </View>
    </Layout>
  );
};

const MetricCard = ({ label, value, emoji }) => (
  <View style={localStyles.card}>
    <Text style={localStyles.cardTitle}>{emoji} {label}</Text>
    <Text style={localStyles.cardValue}>{value}</Text>
  </View>
);

const localStyles = StyleSheet.create({
  centered: {
    alignItems: "center",
    marginTop: 40,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
  },
  weightText: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 20,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ConnectScale;
