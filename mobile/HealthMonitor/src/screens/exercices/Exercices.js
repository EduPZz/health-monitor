import React, { useState } from "react";
import { Text, View, TouchableOpacity, Dimensions, Modal, TouchableWithoutFeedback } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Svg, { Rect, G, Text as SVGText } from "react-native-svg";
import Layout from "../../components/layout";
import ExercicesStyle from "./exercicesStyle";
import { Picker } from "@react-native-picker/picker";

const screenWidth = Dimensions.get("window").width;
const chartWidth = screenWidth * 0.8;
const barCount = 9;
const barWidth = (chartWidth * 0.9) / (barCount * 1.5);
const spacing = (chartWidth - barCount * barWidth) / (barCount + 1);

const initialData = [
  { cardio: 30, musculacao: 60, judo: 30, descanso: 120, label: "Jan 1" },
  { cardio: 60, musculacao: 30, judo: 45, descanso: 90, label: "Jan 2" },
  { cardio: 90, musculacao: 45, judo: 60, descanso: 60, label: "Jan 3" },
  { cardio: 30, musculacao: 60, judo: 20, descanso: 120, label: "Jan 4" },
  { cardio: 45, musculacao: 30, judo: 40, descanso: 90, label: "Jan 5" },
  { cardio: 60, musculacao: 45, judo: 60, descanso: 60, label: "Jan 6" },
  { cardio: 90, musculacao: 30, judo: 50, descanso: 120, label: "Jan 7" },
  { cardio: 30, musculacao: 60, judo: 20, descanso: 90, label: "Jan 8" },
  { cardio: 60, musculacao: 45, judo: 40, descanso: 120, label: "Jan 9" },
];

const colors = { cardio: "#FF6666", musculacao: "#33CC99", judo: "#FF9933", descanso: "#66CC33" };

const Exercices = ({ navigation }) => {
  const goBack = () => navigation.goBack();
  const [data, setData] = useState(initialData);
  const [exerciseType, setExerciseType] = useState(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const formattedDate = date ? `${date.toLocaleString("en-US", { month: "short" })} ${date.getDate()}` : "Selecionar data";

  const [time, setTime] = useState({ hours: 0, minutes: 0 });
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [visibleMiniCard, setVisibleMiniCard] = useState(false);
  const [selectedExerciseInfo, setSelectedExerciseInfo] = useState({ duration: 0, x: 0, y: 0 });

  const maxBarHeight = 200;

  const handleAddExercise = () => {
    if (!exerciseType || !date) return;

    const newData = [...data];
    const targetDayIndex = newData.findIndex((day) => day.label === formattedDate);
    const totalMinutes = time.hours * 60 + time.minutes;

    if (targetDayIndex !== -1) {
      newData[targetDayIndex][exerciseType] += totalMinutes;
    } else {
      newData.push({
        cardio: exerciseType === "cardio" ? totalMinutes : 0,
        musculacao: exerciseType === "musculacao" ? totalMinutes : 0,
        judo: exerciseType === "judo" ? totalMinutes : 0,
        descanso: exerciseType === "descanso" ? totalMinutes : 0,
        label: formattedDate,
      });
    }

    setData(newData);
    setTime({ hours: 0, minutes: 0 });
    setExerciseType(null);
    setDate(null);
  };

  const maxDuration = Math.max(...data.map(day => day.cardio + day.musculacao + day.judo + day.descanso));

  const handleBarPress = (duration, x, y) => {
    setSelectedExerciseInfo({ duration, x, y });
    setVisibleMiniCard(true);
  };

  const closeMiniCard = () => setVisibleMiniCard(false);

  return (
    <Layout goBackFunction={goBack} title="Exercices">
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={[ExercicesStyle.containerGrafico, { paddingHorizontal: 20, paddingVertical: 20 }]}>
          <Text style={ExercicesStyle.textTitles}>Evolução de exercícios</Text>
          <Svg width={chartWidth} height={maxBarHeight + 40} style={{ alignSelf: 'center' }}>
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
                        onPress={() => handleBarPress(exercise, value, (index + 1) * spacing + index * barWidth, yOffset)}
                      />
                    );
                  })}
                  <SVGText x={barWidth / 2} y={maxBarHeight + 15} fontSize="10" fill="black" alignmentBaseline="hanging" textAnchor="middle">
                    {day.label}
                  </SVGText>
                </G>
              );
            })}
          </Svg>

          <View style={ExercicesStyle.legendContainer}>
            {Object.keys(colors).map((exercise) => (
              <View key={exercise} style={ExercicesStyle.legendItem}>
                <View style={[ExercicesStyle.legendColor, { backgroundColor: colors[exercise] }]} />
                <Text style={ExercicesStyle.legendText}>{exercise.charAt(0).toUpperCase() + exercise.slice(1)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={ExercicesStyle.addExerciseContainer}>
          <Text style={ExercicesStyle.title}>Adicionar um exercício</Text>

          <View style={ExercicesStyle.inputGroup}>
            <Text style={ExercicesStyle.label}>Tipo de exercício</Text>
            <TouchableOpacity style={ExercicesStyle.picker} onPress={() => setShowExercisePicker(true)}>
              <Text style={exerciseType ? ExercicesStyle.pickerText : ExercicesStyle.pickerPlaceholder}>
                {exerciseType ? exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1) : "Selecionar exercício"}
              </Text>
            </TouchableOpacity>
            {showExercisePicker && (
              <Picker
                selectedValue={exerciseType}
                onValueChange={(itemValue) => {
                  setExerciseType(itemValue);
                  setShowExercisePicker(false);
                }}
                style={{ width: '100%', position: 'absolute', top: 0, left: 0, opacity: 0 }}
              >
                <Picker.Item label="Cardio" value="cardio" />
                <Picker.Item label="Musculação" value="musculacao" />
                <Picker.Item label="Judô" value="judo" />
                <Picker.Item label="Descanso" value="descanso" />
              </Picker>
            )}
          </View>

          <View style={ExercicesStyle.inputGroup}>
            <Text style={ExercicesStyle.label}>Tempo de execução</Text>
            <TouchableOpacity style={ExercicesStyle.picker} onPress={() => setShowTimePicker(true)}>
              <Text style={time.hours || time.minutes ? ExercicesStyle.pickerText : ExercicesStyle.pickerPlaceholder}>
                {time.hours > 0 ? `${time.hours}h` : ""} {time.minutes}m
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={new Date(0, 0, 0, time.hours, time.minutes)}
                mode="time"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);
                  if (selectedDate) {
                    setTime({
                      hours: selectedDate.getHours(),
                      minutes: selectedDate.getMinutes(),
                    });
                  }
                }}
              />
            )}
          </View>

          <View style={ExercicesStyle.inputGroup}>
            <Text style={ExercicesStyle.label}>Data</Text>
            <TouchableOpacity style={ExercicesStyle.picker} onPress={() => setShowDatePicker(true)}>
              <Text style={date ? ExercicesStyle.pickerText : ExercicesStyle.pickerPlaceholder}>{formattedDate}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="calendar"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}
          </View>

          <TouchableOpacity style={ExercicesStyle.addButton} onPress={handleAddExercise}>
            <Text style={ExercicesStyle.addText}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        {visibleMiniCard && (
          <TouchableWithoutFeedback onPress={closeMiniCard}>
            <View style={ExercicesStyle.overlay}>
              <View
                style={[
                  ExercicesStyle.miniCard,
                  {
                    top: selectedExerciseInfo.y - 30,
                    left: selectedExerciseInfo.x + 20,
                  },
                ]}
              >
                <Text style={ExercicesStyle.miniCardText}>
                  {selectedExerciseInfo.duration}m
                </Text>
                <View style={ExercicesStyle.miniCardPointer} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </Layout>
  );
};

export default Exercices;
