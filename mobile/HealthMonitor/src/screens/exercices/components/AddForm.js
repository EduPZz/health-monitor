import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ExercicesStyle from "../exercicesStyle";
import api from "../../../api/index";

const AddExerciseForm = ({ userId }) => {
  const [exerciseType, setExerciseType] = useState(null);
  const [beginTime, setBeginTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showBeginDatePicker, setShowBeginDatePicker] = useState(false);
  const [showBeginTimePicker, setShowBeginTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddExercise = async () => {
    if (!exerciseType || !beginTime || !endTime) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (endTime <= beginTime) {
      Alert.alert("Erro", "A data de fim deve ser após a data de início.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("exercise", {
        beginTime,
        endTime,
        type: exerciseType,
        userId,
      });
      // onAddExercise(data);
      setBeginTime(null);
      setEndTime(null);
      setExerciseType(null);
      Alert.alert("Sucesso", "Exercício adicionado com sucesso");
    } catch (error) {
      Alert.alert("Erro", "não foi possível adicionar o exercício");
    } finally {
      setLoading(false);
    }
    setExerciseType(null);
    setBeginTime(null);
    setEndTime(null);
  };

  return (
    <View style={ExercicesStyle.addExerciseContainer}>
      <Text style={ExercicesStyle.title}>Adicionar um exercício</Text>

      <View style={ExercicesStyle.inputGroup}>
        <Text style={ExercicesStyle.label}>Tipo de exercício</Text>
        <TextInput
          style={[ExercicesStyle.pickerPlaceholder, ExercicesStyle.picker]}
          placeholder="Selecionar exercício"
          value={exerciseType}
          onChangeText={setExerciseType}
        />
      </View>

      <View style={ExercicesStyle.inputGroup}>
        <Text style={ExercicesStyle.label}>Início</Text>
        <TouchableOpacity
          style={ExercicesStyle.picker}
          onPress={() => setShowBeginDatePicker(true)}
        >
          <Text
            style={
              beginTime
                ? ExercicesStyle.pickerText
                : ExercicesStyle.pickerPlaceholder
            }
          >
            {beginTime ? beginTime.toLocaleString() : "Selecionar início"}
          </Text>
        </TouchableOpacity>
        {showBeginDatePicker && (
          <DateTimePicker
            value={beginTime || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowBeginDatePicker(false);
              if (selectedDate) {
                setBeginTime(
                  (prev) =>
                    new Date(
                      selectedDate.setHours(
                        prev?.getHours() || 0,
                        prev?.getMinutes() || 0
                      )
                    )
                );
                setShowBeginTimePicker(true);
              }
            }}
          />
        )}
        {showBeginTimePicker && (
          <DateTimePicker
            value={beginTime || new Date()}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowBeginTimePicker(false);
              if (selectedTime) {
                setBeginTime(
                  (prev) =>
                    new Date(
                      prev.setHours(
                        selectedTime.getHours(),
                        selectedTime.getMinutes()
                      )
                    )
                );
              }
            }}
          />
        )}
      </View>

      <View style={ExercicesStyle.inputGroup}>
        <Text style={ExercicesStyle.label}>Fim</Text>
        <TouchableOpacity
          style={ExercicesStyle.picker}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text
            style={
              endTime
                ? ExercicesStyle.pickerText
                : ExercicesStyle.pickerPlaceholder
            }
          >
            {endTime ? endTime.toLocaleString() : "Selecionar fim"}
          </Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endTime || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                setEndTime(
                  (prev) =>
                    new Date(
                      selectedDate.setHours(
                        prev?.getHours() || 0,
                        prev?.getMinutes() || 0
                      )
                    )
                );
                setShowEndTimePicker(true);
              }
            }}
          />
        )}
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime || new Date()}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowEndTimePicker(false);
              if (selectedTime) {
                setEndTime(
                  (prev) =>
                    new Date(
                      prev.setHours(
                        selectedTime.getHours(),
                        selectedTime.getMinutes()
                      )
                    )
                );
              }
            }}
          />
        )}
      </View>

      <TouchableOpacity
        style={ExercicesStyle.addButton}
        onPress={handleAddExercise}
        disabled={loading}
      >
        <Text style={ExercicesStyle.addText}>
          {loading ? "Adicionando..." : "Adicionar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddExerciseForm;
