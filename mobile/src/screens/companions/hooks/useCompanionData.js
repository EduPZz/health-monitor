import { useState, useEffect } from "react";
import { Alert } from "react-native";
import api from "../../../api";

export const useCompanionData = (companionId) => {
  const [companion, setCompanion] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const sort = (elements) => {
    return elements
      ? [...elements.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      : [];
  };

  const fetchCompanionData = async () => {
    try {
      const [measurementsResponse, exercisesResponse] = await Promise.all([
        api.get(`/body-measure/user/${companionId}`),
        api.get(`/exercise/user/${companionId}`),
      ]);

      setMeasurements(sort(measurementsResponse));
      setExercises(sort(exercisesResponse));
    } catch (error) {
      console.error("Error fetching companion data:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do acompanhado");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompanionData();
  };

  useEffect(() => {
    fetchCompanionData();
  }, [companionId]);

  return {
    companion,
    setCompanion,
    measurements,
    exercises,
    loading,
    refreshing,
    onRefresh,
    fetchCompanionData,
  };
};
