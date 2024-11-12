import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import MeasureForm from "./components/MeasureForm";
import styles from "./styles.js";
import api from "../../api/index.js";
import { ActivityIndicator, View, Text } from "react-native";
import { TouchableOpacity } from "react-native";

const measurementsModel = {
  chest: "",
  arm: "",
  waist: "",
  thigh: "",
  hip: "",
  calf: "",
  weight: "",
  height: "",
};
const Measures = ({ navigation }) => {
  const [lastMeasurements, setLastMeasurements] = useState(measurementsModel);
  const [penultimateMeasurements, setPenultimateMeasurements] =
    useState(measurementsModel);
  const [measureNotCreatedYet, setMeasurementNotCreatedYet] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMeasures = async () => {
      try {
        const { data } = await api.get("body-measure");

        if (data.length === 0) {
          setMeasurementNotCreatedYet(true);
          return;
        }

        const sortedBodyMeasure = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setLastMeasurements(sortedBodyMeasure[0]);
        setMeasurementNotCreatedYet(false);

        if (sortedBodyMeasure.length > 1) {
          setPenultimateMeasurements(sortedBodyMeasure[1]);
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

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("body-measure", {
        ...serializedLastMeasurements(lastMeasurements),
      });
      setLastMeasurements(data);
      setMeasurementNotCreatedYet(false);
      if (isEditing) {
        setIsEditing(false);
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as medidas");
    } finally {
      setLoading(false);
    }
  };

  const resetValues = () => {
    if (isEditing) {
      setIsEditing(false);
      return;
    }
    setLastMeasurements(measurementsModel);
  };

  const goBack = () => navigation.goBack();

  const getIndicator = (current, previous) => {
    if (!previous) return null;
    return current > previous ? "↑" : current < previous ? "↓" : null;
  };

  const serializedLastMeasurements = (measurement) => {
    return {
      chest: +measurement.chest,
      arm: +measurement.arm,
      thigh: +measurement.thigh,
      hip: +measurement.hip,
      calf: +measurement.calf,
      weight: measurement.weight,
      height: measurement.height,
      waist: +measurement.waist,
    };
  };

  const measurementTranslate = {
    chest: "Peito (cm)",
    arm: "Braço (cm)",
    waist: "Cintura (cm)",
    thigh: "Coxa (cm)",
    hip: "Quadril (cm)",
    calf: "Panturrilha (cm)",
    weight: "Peso (kg)",
    height: "Altura (m)",
    waist: "Cintura (cm)",
  };

  return (
    <Layout goBackFunction={goBack} title={"Medidas Corporais"}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : measureNotCreatedYet ? (
        <MeasureForm
          stylesFromProp={styles.form}
          title={"Criar Medidas Corporais"}
          measurements={lastMeasurements}
          setMeasurements={setLastMeasurements}
          onSave={handleSave}
          onCancel={resetValues}
        />
      ) : !isEditing ? (
        <>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.editButtonLabel}>Editar Medidas</Text>
          </TouchableOpacity>
          <View style={styles.measurementGrid}>
            {Object.keys(serializedLastMeasurements(lastMeasurements)).map(
              (key) => (
                <View style={styles.measurementCard} key={key}>
                  <Text style={styles.measurementLabel}>
                    {measurementTranslate[key]}
                  </Text>
                  <Text style={styles.measurementValue}>
                    {lastMeasurements[key]}
                    {" " +
                      measurementTranslate[key].split("(")[1].replace(")", "")}
                    <Text
                      style={
                        getIndicator(
                          lastMeasurements[key],
                          penultimateMeasurements[key]
                        ) === "↑"
                          ? styles.increaseIndicator
                          : styles.decreaseIndicator
                      }
                    >
                      {getIndicator(
                        lastMeasurements[key],
                        penultimateMeasurements[key]
                      )}
                    </Text>
                  </Text>
                </View>
              )
            )}
          </View>
        </>
      ) : (
        <MeasureForm
          stylesFromProp={styles.form}
          title={"Editar Medidas Corporais"}
          measurements={lastMeasurements}
          isEditing={isEditing}
          setMeasurements={setLastMeasurements}
          onSave={handleSave}
          onCancel={resetValues}
        />
      )}
    </Layout>
  );
};

export default Measures;
