import React from "react";
import Layout from "../../components/layout";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icons from "../../components/Icons";

const MeasurementSelection = ({ navigation }) => {
  const goBack = () => navigation.goBack();

  return (
    <Layout goBackFunction={goBack} title={"Nova Pesagem"}>
      <View style={localStyles.container}>
        <Text style={localStyles.subtitle}>
          Escolha como deseja realizar a medição
        </Text>

        <TouchableOpacity
          style={localStyles.optionCard}
          onPress={() => navigation.navigate("ConnectScale")}
        >
          <View style={localStyles.iconContainer}>
            <Icons.FontAwesome6 name="weight-scale" size={48} color="#4CAF50" />
          </View>
          <Text style={localStyles.optionTitle}>Com Balança</Text>
          <Text style={localStyles.optionDescription}>
            Conecte-se à sua balança inteligente para medição automática
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={localStyles.optionCard}
          onPress={() => navigation.navigate("ManualMeasurement")}
        >
          <View style={localStyles.iconContainer}>
            <Icons.MaterialCommunityIcons
              name="clipboard-text"
              size={48}
              color="#2196F3"
            />
          </View>
          <Text style={localStyles.optionTitle}>Entrada Manual</Text>
          <Text style={localStyles.optionDescription}>
            Digite os valores manualmente capturados a partir de uma medição externa
          </Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 24,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  optionCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#22313F",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 200,
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#22313F",
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default MeasurementSelection;

