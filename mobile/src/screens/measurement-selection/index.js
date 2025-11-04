import React from "react";
import Layout from "../../components/layout";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icons from "../../components/Icons";

const MeasurementSelection = ({ navigation, route }) => {
  const eventId = route?.params?.eventId;
  const recipientType = route?.params?.recipientType;
  const recipientData = route?.params?.recipientData;
  const isEventMeasurement = !!eventId;

  const goBack = () => navigation.goBack();

  const navigateToConnectScale = () => {
    if (isEventMeasurement) {
      navigation.navigate("ConnectScale", {
        eventId,
        recipientType,
        recipientData,
      });
    } else {
      navigation.navigate("ConnectScale");
    }
  };

  const navigateToManualMeasurement = () => {
    if (isEventMeasurement) {
      navigation.navigate("ManualMeasurement", {
        eventId,
        recipientType,
        recipientData,
      });
    } else {
      navigation.navigate("ManualMeasurement");
    }
  };

  return (
    <Layout 
      goBackFunction={goBack} 
      title={isEventMeasurement ? "Nova Medição" : "Nova Pesagem"}
    >
      <View style={localStyles.container}>
        <Text style={localStyles.subtitle}>
          {isEventMeasurement 
            ? "Escolha como deseja realizar a medição para este evento"
            : "Escolha como deseja realizar a medição"}
        </Text>

        <TouchableOpacity
          style={localStyles.optionCard}
          onPress={navigateToConnectScale}
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
          onPress={navigateToManualMeasurement}
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