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

const colors = { cardio: "#FF6666", musculacao: "#33CC99", judo: "#FF9933", descanso: "#66CC33" };

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
  // Função para transformar dados do banco de dados para o formato do gráfico
  const transformDataForChart = (exercises) => {
    const dailyData = {};

    exercises.forEach((exercise) => {
      const date = new Date(exercise.beginTime).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const duration = (new Date(exercise.endTime) - new Date(exercise.beginTime)) / (1000 * 60); // duração em minutos

      if (!dailyData[date]) {
        dailyData[date] = { cardio: 0, musculacao: 0, judo: 0, descanso: 0, label: date };
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

  // Função para buscar dados da API
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

  // Verifica se há dados para mostrar
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

  // Calcula o valor máximo da duração de todos os exercícios
  const renderChartData = () => {
    return data.map((day, index) => {
      maxDuration = 0;
      Object.values(day).forEach(function (value) { if (!isNaN(value)) { maxDuration += value } })
      yOffset = maxBarHeight;

      return (
        <G key={index} x={(index + 1) * spacing + index * barWidth}>
          {Object.keys(day).map((exercise) => {
            if(isNaN(day[exercise])) {
              return
            }
            const color = generateRandomColor();

            const value = day[exercise] || 0; // Garante que o valor seja 0 caso não exista
            const barHeight = !maxDuration ? 0 : (value / maxDuration) * maxBarHeight;
            yOffset -= barHeight;
            console.log(exercise, maxBarHeight,yOffset, barWidth, barHeight, color)
            console.log(typeof exercise, typeof maxBarHeight, typeof yOffset, typeof barWidth, typeof barHeight, typeof color)

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

  // Função para adicionar um novo exercício e atualizar o gráfico
  const handleAddExercise = async (newExerciseData) => {
    try {
      await api.post("exercise", newExerciseData);
      fetchExercises(); // Recarrega os dados para atualizar o gráfico
    } catch (error) {
      console.error("Erro ao adicionar exercício:", error);
      Alert.alert("Erro", "Não foi possível adicionar o exercício.");
    }
  };
  console.log(maxBarHeight, chartWidth)
  return (
    <Layout goBackFunction={goBack} title="Exercices">
      <KeyboardAwareScrollView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={[ExercicesStyle.containerGrafico, { paddingHorizontal: 20, paddingVertical: 20 }]}>
            <Text style={ExercicesStyle.textTitles}>Evolução de exercícios</Text>
            <Svg width={chartWidth} height={maxBarHeight + 40} style={{ alignSelf: "center" }}>
              {
                renderChartData()}
            </Svg>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <AddExerciseForm onAddExercise={fetchExercises} />
    </Layout>
  );
};
export default Exercices;
