import React, { useState } from "react";
import { Text, View, Dimensions, TouchableWithoutFeedback } from "react-native";
import Svg, { Rect, G, Text as SVGText } from "react-native-svg";
import Layout from "../../components/layout";
import ExercicesStyle from "./exercicesStyle";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AddExerciseForm from "./components/AddForm";

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth * 0.8;
const barCount = 9;
const barWidth = (chartWidth * 0.9) / (barCount * 1.5);
const spacing = (chartWidth - barCount * barWidth) / (barCount + 1);

const initialData = [
  { cardio: 30, musculacao: 60, judo: 30, descanso: 120, label: "Jan 1" },
  // ... other data
];

const colors = {
  cardio: "#FF6666",
  musculacao: "#33CC99",
  judo: "#FF9933",
  descanso: "#66CC33",
};

const Exercices = ({ navigation }) => {
  const goBack = () => navigation.goBack();
  const [data, setData] = useState(initialData);
  const [visibleMiniCard, setVisibleMiniCard] = useState(false);
  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState({
    duration: 0,
    x: 0,
    y: 0,
  });

  const maxBarHeight = 200;

  const handleAddExercise = ({ exerciseType, date, duration }) => {
    const newData = [...data];
    const targetDayIndex = newData.findIndex((day) => day.label === date);

    if (targetDayIndex !== -1) {
      newData[targetDayIndex][exerciseType] += duration;
    } else {
      newData.push({
        cardio: exerciseType === "cardio" ? duration : 0,
        musculacao: exerciseType === "musculacao" ? duration : 0,
        judo: exerciseType === "judo" ? duration : 0,
        descanso: exerciseType === "descanso" ? duration : 0,
        label: date,
      });
    }

    setData(newData);
  };

  const maxDuration = Math.max(
    ...data.map((day) => day.cardio + day.musculacao + day.judo + day.descanso)
  );

  return (
    <Layout goBackFunction={goBack} title="Exercices">
      <KeyboardAwareScrollView>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View
            style={[
              ExercicesStyle.containerGrafico,
              { paddingHorizontal: 20, paddingVertical: 20 },
            ]}
          >
            <Text style={ExercicesStyle.textTitles}>
              Evolução de exercícios
            </Text>
            <Svg
              width={chartWidth}
              height={maxBarHeight + 40}
              style={{ alignSelf: "center" }}
            >
              {data.map((day, index) => {
                let yOffset = maxBarHeight;
                return (
                  <G key={index} x={(index + 1) * spacing + index * barWidth}>
                    {Object.keys(colors).map((exercise) => {
                      const value = day[exercise];
                      const barHeight = (value / maxDuration) * maxBarHeight;
                      yOffset -= barHeight;
                      return (
                        <Rect
                          key={exercise}
                          y={yOffset}
                          width={barWidth}
                          height={barHeight}
                          fill={colors[exercise]}
                          onPress={() =>
                            handleBarPress(
                              exercise,
                              value,
                              (index + 1) * spacing + index * barWidth,
                              yOffset
                            )
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
              })}
            </Svg>

            <View style={ExercicesStyle.legendContainer}>
              {Object.keys(colors).map((exercise) => (
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
              ))}
            </View>
          </View>
          <AddExerciseForm onAddExercise={handleAddExercise} />
        </View>
      </KeyboardAwareScrollView>
    </Layout>
  );
};

export default Exercices;
