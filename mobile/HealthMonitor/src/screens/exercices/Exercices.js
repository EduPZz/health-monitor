import React, { useEffect, useState } from "react";
import { Text, View, Dimensions, TouchableWithoutFeedback, Alert } from "react-native";
import Svg, { Rect, G, Text as SVGText } from "react-native-svg";
import Layout from "../../components/layout";
import ExercicesStyle from "./exercicesStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AddExerciseForm from "./components/AddForm";
import api from "../../api/index.js";

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth * 0.8;
const barCount = 9;
const barWidth = (chartWidth * 0.9) / (barCount * 1.5);
const spacing = (chartWidth - barCount * barWidth) / (barCount + 1);

const Exercices = ({ navigation }) => {
  const goBack = () => navigation.goBack();
  const [data, setData] = useState([]);
  const [visibleMiniCard, setVisibleMiniCard] = useState(false);
  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState({
    duration: 0,
    x: 0,
    y: 0,
  });
  const [loading, setLoading] = useState(true);
  const maxBarHeight = 200;

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  colors = {}
  data.forEach(function (exercices) {
    Object.keys(exercices).forEach(function (exercice) {
      if (!(exercice in colors)) {
        colors[exercice] = generateRandomColor()
      }
    })
  })

  const transformDataForChart = (exercises) => {
    const dailyData = {};

    exercises.forEach((exercise) => {
      const date = new Date(exercise.beginTime).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const duration = (new Date(exercise.endTime) - new Date(exercise.beginTime)) / (1000 * 60); // duração em minutos

      if (!dailyData[date]) {
        dailyData[date] = { label: date };
      }
      if (!dailyData[date][exercise.type]) {
        dailyData[date][exercise.type] = 0
      }
      if (dailyData[date][exercise.type] !== undefined) {
        dailyData[date][exercise.type] += duration;
      }
    });
    return Object.values(dailyData);
  };

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const { data: fetchedData } = await api.get("exercise");

      setData(transformDataForChart(fetchedData));
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      Alert.alert("Erro", "Não foi possível buscar os dados de exercícios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  if (data.length === 0) {
    return (
      <Layout goBackFunction={goBack} title="Exercices">
        <KeyboardAwareScrollView>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text>Não há dados de exercícios para exibir.</Text>
          </View>
        </KeyboardAwareScrollView>
      </Layout>
    );
  }

  const renderChartData = () => {
    return data.map((day, index) => {
      maxDuration = 0;
      Object.values(day).forEach(function (value) { if (!isNaN(value)) { maxDuration += value } })
      yOffset = maxBarHeight;

      return (
        <G key={index} x={(index + 1) * spacing + index * barWidth}>
          {Object.keys(day).map((exercise) => {
            if (isNaN(day[exercise])) {
              return
            }
            const color = colors[exercise];

            const value = day[exercise] || 0;
            const barHeight = !maxDuration ? 0 : (value / maxDuration) * maxBarHeight;
            yOffset -= barHeight;

            return (
              <Rect
                key={exercise}
                y={yOffset}
                width={barWidth}
                height={barHeight}
                fill={color}
                onPress={() =>
                  console.log(`Exercício ${exercise} com duração ${value} minutos`)
                }
              />
            );
          })}
          <SVGText
            x={barWidth / 2}
            y={maxBarHeight + 15}
            fontSize="10"
            fill="black"
            alignmentBaseline="hanging"
            textAnchor="middle"
          >
            {day.label}
          </SVGText>
        </G>
      );
    });
  };

  const handleAddExercise = async (newExerciseData) => {
    try {
      await api.post("exercise", newExerciseData);
      fetchExercises();
    } catch (error) {
      console.error("Erro ao adicionar exercício:", error);
      Alert.alert("Erro", "Não foi possível adicionar o exercício.");
    }
  };

  const renderLegend = () => {
    const exercises = Object.keys(colors);
    return exercises.map((exercise) => {
      return (
        <View key={exercise} style={ExercicesStyle.legendItem}>
          <View style={[ExercicesStyle.legendColor, { backgroundColor: colors[exercise] }]} />
          <Text style={ExercicesStyle.legendText}>
            {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
          </Text>
        </View>
      );
    });
  };

  return (
    <Layout goBackFunction={goBack} title="Exercices">
      <KeyboardAwareScrollView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={ExercicesStyle.containerGrafico}>
            <Text style={ExercicesStyle.textTitles}>Evolução de exercícios</Text>
            <Svg width={chartWidth} height={maxBarHeight + 40} style={{ alignSelf: "center" }}>
              {renderChartData()}
            </Svg>
            <View style={ExercicesStyle.legendContainer}>
              {renderLegend()}
            </View>
          </View>
          <AddExerciseForm onAddExercise={fetchExercises} />
        </View>
      </KeyboardAwareScrollView>
    </Layout>
  );
};
export default Exercices;
