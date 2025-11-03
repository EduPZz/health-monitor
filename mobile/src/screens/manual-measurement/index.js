import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import api from "../../api";

const MetricCard = ({ label, value, emoji }) => (
  <View style={localStyles.card}>
    <Text style={localStyles.cardTitle}>
      {emoji} {label}
    </Text>
    <Text style={localStyles.cardValue}>{value}</Text>
  </View>
);

const ManualMeasurement = ({ navigation, route }) => {
  const eventId = route?.params?.eventId;
  const [weight, setWeight] = useState("");
  const [bioImpedanceValues, setBioImpedanceValues] = useState({
    fatPercentage: 0,
    waterPercentage: 0,
    muscleMass: 0,
    boneMass: 0,
    visceralFat: 0,
    metabolicAge: 0
  });

  const goBack = () => navigation.goBack();

  useEffect(() => {
    const fetchMeasures = async () => {
      try {
        const { data } = await api.get("body-measure");

        const lastBodyMeasure = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0];
        if (lastBodyMeasure?.weight) {
          setWeight(lastBodyMeasure.weight.toString());
        }
      } catch (error) {
        console.error("Erro ao buscar as medidas corporais:", error);
        Alert.alert("Erro", "Não foi possível buscar as medidas corporais.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeasures();
  }, []);

  const transformToNumber = (value) => {
    const numberValue = parseFloat(value);
    return isNaN(numberValue) ? 0 : numberValue;
  }

  const saveScaleData = async () => {
    try {
      await api.post("/measurement-sessions", {
        measurementType: "form",
        anonymous: false,
        eventId: eventId || undefined,
        bioimpedanceMeasurement: {
          weight: transformToNumber(weight),
          bodyFatPercentage: transformToNumber(bioImpedanceValues.fatPercentage),
          muscleMass: transformToNumber(bioImpedanceValues.muscleMass),
          boneMass: transformToNumber(bioImpedanceValues.boneMass),
          waterPercentage: transformToNumber(bioImpedanceValues.waterPercentage),
          visceralFat: transformToNumber(bioImpedanceValues.visceralFat),
          metabolicAge: transformToNumber(bioImpedanceValues.metabolicAge),
        },
      });

      Alert.alert("Sucesso", "Dados salvos com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            if (eventId) {
              // Navigate back to EventDetails if this was an event measurement
              navigation.navigate("EventDetails", { eventId });
            } else {
              // Otherwise go back normally
              navigation.goBack();
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Failed to save data:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Erro ao salvar os dados"
      );
    }
  };

  return (
    <Layout goBackFunction={goBack} title={"Entrada Manual"}>
      <KeyboardAwareScrollView
        contentContainerStyle={localStyles.scroll}
        keyboardShouldPersistTaps="handled"
        extraHeight={100}
      >
        <View style={localStyles.formContainer}>
          <Text style={localStyles.formTitle}>Preencha seus dados</Text>

          <Text style={localStyles.label}>Peso (kg) *</Text>
          <TextInput
            style={localStyles.input}
            keyboardType="decimal-pad"
            value={weight}
            onChangeText={setWeight}
            placeholder="Ex: 70.5"
          />

          <Text style={localStyles.label}>Porcentagem de Gordura Corporal (%)</Text>
          <TextInput
            style={localStyles.input}
            keyboardType="decimal-pad"
            value={bioImpedanceValues.fatPercentage}
            onChangeText={(value) =>
              setBioImpedanceValues({
                ...bioImpedanceValues,
                fatPercentage: value,
              })
            }
            placeholder="Ex: 20.5"
          />

          <Text style={localStyles.label}>Porcentagem de Água (%)</Text>
          <TextInput
            style={localStyles.input}
            keyboardType="decimal-pad"
            value={bioImpedanceValues.waterPercentage}
            onChangeText={(value) => {
              setBioImpedanceValues({
                ...bioImpedanceValues,
                waterPercentage: value,
              });
            }}
            placeholder="Ex: 55.0"
          />


          <Text style={localStyles.label}>Massa Muscular (kg)</Text>
          <TextInput
            style={localStyles.input}
            keyboardType="decimal-pad"
            value={bioImpedanceValues.muscleMass}
            onChangeText={(value) =>
              setBioImpedanceValues({
                ...bioImpedanceValues,
                muscleMass: value,
              })
            }
            placeholder="Ex: 30.0"
          />

          <Text style={localStyles.label}>Massa Óssea (kg)</Text>
          <TextInput
            style={localStyles.input}
            keyboardType="decimal-pad"
            value={bioImpedanceValues.boneMass}
            onChangeText={(value) =>
              setBioImpedanceValues({
                ...bioImpedanceValues,
                boneMass: value,
              })
            }
            placeholder="Ex: 3.0"
          />

          <Text style={localStyles.label}>Gordura Visceral</Text>
          <TextInput
            style={localStyles.input}
            keyboardType="decimal-pad"
            value={bioImpedanceValues.visceralFat}
            onChangeText={(value) =>
              setBioImpedanceValues({
                ...bioImpedanceValues,
                visceralFat: value,
              })
            }
            placeholder="Ex: 10.0"
          />

          <Text style={localStyles.label}>Idade Metabólica</Text>
          <TextInput
            style={localStyles.input}
            keyboardType="numeric"
            value={bioImpedanceValues.metabolicAge}
            onChangeText={(value) =>
              setBioImpedanceValues({
                ...bioImpedanceValues,
                metabolicAge: value,
              })
            }
            placeholder="Ex: 30"
          />

          <TouchableOpacity style={localStyles.buttonContainer} onPress={saveScaleData}>
            <Text>
              Salvar Dados
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </Layout>
  );
};

const localStyles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 16,
    flexGrow: 1,
    paddingBottom: 20,
  },
  formContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
    color: "#22313F",
  },
  hint: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    fontSize: 16,
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
  buttonContainer: {
    backgroundColor: "#EEF5FF",
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 30,
  },
});

export default ManualMeasurement;

