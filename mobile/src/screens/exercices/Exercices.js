import React, { useEffect, useState, useMemo } from "react";
import {
  Text,
  View,
  Dimensions,
  Alert,
} from "react-native";
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
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState({
    exercise: null,
    duration: 0,
    dayIndex: 0,
    yOffset: 0,
    barHeight: 0,
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

  const colors = useMemo(() => {
    const colorMap = {};
    data.forEach(function (exercices) {
      Object.keys(exercices).forEach(function (exercice) {
        if (!(exercice in colorMap)) {
          colorMap[exercice] = generateRandomColor();
        }
      });
    });
    return colorMap;
  }, [data]);

  const transformDataForChart = (exercises) => {
    const dailyData = {};

    exercises.forEach((exercise) => {
      const date = new Date(exercise.beginTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const duration =
        (new Date(exercise.endTime) - new Date(exercise.beginTime)) /
        (1000 * 60); // duração em minutos

      if (!dailyData[date]) {
        dailyData[date] = { label: date };
      }
      if (!dailyData[date][exercise.type]) {
        dailyData[date][exercise.type] = 0;
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
            <AddExerciseForm onAddExercise={fetchExercises} />
          </View>
        </KeyboardAwareScrollView>
      </Layout>
    );
  }

  const getTooltipPosition = (index, yOffset, barHeight) => {
    const barCenterX = (index + 1) * spacing + index * barWidth + barWidth / 2;
    const tooltipWidth = 200;
    const tooltipHeight = 50;
    
    let left = barCenterX - tooltipWidth / 2;
    
    if (left < 0) {
      left = 5;
    }
    
    if (left + tooltipWidth > chartWidth) {
      left = chartWidth - tooltipWidth - 5;
    }
    
    let top = yOffset - tooltipHeight - 5;
    
    if (top < 0) {
      top = yOffset + barHeight + 5;
    }
    
    return { left, top };
  };

  const renderChartData = () => {
    return data.map((day, index) => {
      let maxDuration = 0;
      Object.values(day).forEach(function (value) {
        if (!isNaN(value)) {
          maxDuration += value;
        }
      });
      let yOffset = maxBarHeight;

      return (
        <G key={index} x={(index + 1) * spacing + index * barWidth}>
          {Object.keys(day).map((exercise) => {
            if (isNaN(day[exercise])) {
              return;
            }
            const color = colors[exercise];

            const value = day[exercise] || 0;
            const barHeight = !maxDuration
              ? 0
              : (value / maxDuration) * maxBarHeight;
            yOffset -= barHeight;

            const key = `${index}-${exercise}`;

            return (
              <Rect
                key={key}
                y={yOffset}
                width={barWidth}
                height={barHeight}
                fill={color}
                style={{ opacity: selectedCell !== key && selectedCell ? 0.3 : 1 }}
                onPressIn={() => {
                  setSelectedCell(key);
                  setSelectedExerciseInfo({
                    exercise,
                    duration: value,
                    dayIndex: index,
                    yOffset,
                    barHeight,
                  });
                }}
                onPressOut={() => {
                  setSelectedCell(null);
                  setSelectedExerciseInfo({
                    exercise: null,
                    duration: 0,
                    dayIndex: 0,
                    yOffset: 0,
                    barHeight: 0,
                  });
                }}
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
          <View
            style={[
              ExercicesStyle.legendColor,
              { backgroundColor: colors[exercise] },
            ]}
          />
          <Text style={ExercicesStyle.legendText}>
            {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
          </Text>
        </View>
      );
    });
  };

  return (
    <Layout goBackFunction={goBack} title="Exercícios">
      <KeyboardAwareScrollView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={ExercicesStyle.containerGrafico}>
            <Text style={ExercicesStyle.textTitles}>
              Evolução de exercícios
            </Text>
            <View style={{ position: "relative", width: chartWidth }}>
              <Svg
                width={chartWidth}
                height={maxBarHeight + 40}
                style={{ alignSelf: "center" }}
              >
                {renderChartData()}
              </Svg>
              {selectedCell && selectedExerciseInfo.exercise && (
                <View
                  style={{
                    position: "absolute",
                    ...getTooltipPosition(
                      selectedExerciseInfo.dayIndex,
                      selectedExerciseInfo.yOffset,
                      selectedExerciseInfo.barHeight
                    ),
                    backgroundColor: "white",
                    padding: 8,
                    borderRadius: 5,
                    zIndex: 1000,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    maxWidth: 200,
                  }}
                >
                  <Text style={{ fontSize: 12 }}>
                    {`Exercício: ${selectedExerciseInfo.exercise}\nDuração: ${selectedExerciseInfo.duration.toFixed(1)} minutos`}
                  </Text>
                </View>
              )}
            </View>
            <View style={ExercicesStyle.legendContainer}>{renderLegend()}</View>
          </View>
          <AddExerciseForm onAddExercise={fetchExercises} />
        </View>
      </KeyboardAwareScrollView>
    </Layout>
  );
};
export default Exercices;
