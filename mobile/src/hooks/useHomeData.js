import { useState, useEffect } from "react";
import api from "../api";

export const useHomeData = () => {
  const [data, setData] = useState({
    bodyMeasures: [],
    consultations: [],
    exercises: [],
    bluetoothScales: [],
    latestWeight: null,
    latestMeasures: null,
    upcomingConsultations: [],
    recentExercises: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        bodyMeasuresResponse,
        consultationsResponse,
        exercisesResponse,
        bluetoothScalesResponse,
      ] = await Promise.all([
        api.get("/body-measure"),
        api.get("/consultation"),
        api.get("/exercise"),
        api.get("/bluetooth-scales"),
      ]);

      const bodyMeasures = bodyMeasuresResponse.data || [];
      const consultations = consultationsResponse.data || [];
      const exercises = exercisesResponse.data || [];
      const bluetoothScales = bluetoothScalesResponse.data || [];

      // Process body measures data
      const latestMeasures = bodyMeasures.length > 0 ? bodyMeasures[0] : null;
      const weightMeasures = bodyMeasures.filter((measure) => measure.weight);
      const latestWeight = weightMeasures.length > 0 ? weightMeasures[0] : null;

      // Process consultations data
      const upcomingConsultations = consultations
        .filter(
          (consultation) => new Date(consultation.scheduleDate) > new Date()
        )
        .sort((a, b) => new Date(a.scheduleDate) - new Date(b.scheduleDate))
        .slice(0, 3);

      // Process exercises data
      const recentExercises = exercises
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setData({
        bodyMeasures,
        consultations,
        exercises,
        bluetoothScales,
        latestWeight,
        latestMeasures,
        upcomingConsultations,
        recentExercises,
      });
    } catch (err) {
      console.error("Error fetching home data:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (current, previous) => {
    if (!current || !previous) return null;
    const diff = current - previous;
    const percentage = (diff / previous) * 100;

    if (Math.abs(percentage) < 1) return null; // No significant change

    return {
      direction: diff > 0 ? "up" : "down",
      value: `${Math.abs(percentage).toFixed(1)}%`,
      percentage: Math.abs(percentage),
    };
  };

  const getWeightTrend = () => {
    if (data.bodyMeasures.length < 2) return null;
    const current = data.bodyMeasures[0]?.weight;
    const previous = data.bodyMeasures[1]?.weight;
    return calculateTrend(current, previous);
  };

  const getMeasuresTrend = () => {
    if (data.bodyMeasures.length < 2) return null;
    const current =
      data.bodyMeasures[0]?.chestCircumference ||
      data.bodyMeasures[0]?.waistCircumference;
    const previous =
      data.bodyMeasures[1]?.chestCircumference ||
      data.bodyMeasures[1]?.waistCircumference;
    return calculateTrend(current, previous);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refreshData = () => {
    fetchAllData();
  };

  return {
    data,
    loading,
    error,
    refreshData,
    getWeightTrend,
    getMeasuresTrend,
  };
};
