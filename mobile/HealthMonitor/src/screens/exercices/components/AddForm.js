import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import ExercicesStyle from "../exercicesStyle";
import api from "../../../api/index";

const AddExerciseForm = ({ userId, onAddExercise }) => {
  const [exerciseType, setExerciseType] = useState(null);
  const [beginTime, setBeginTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showBeginTimePicker, setShowBeginTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleAddExercise = () => {
    if (!exerciseType || !beginTime || !endTime) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (endTime <= beginTime) {
      Alert.alert("Erro", "A data de fim deve ser após a data de início.");
      return;
    }

    onAddExercise({
      exerciseType,
      beginTime,
      endTime,
    });

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
          onPress={() => setShowBeginTimePicker(true)}
        >
          <Text style={beginTime ? ExercicesStyle.pickerText : ExercicesStyle.pickerPlaceholder}>
            {beginTime ? beginTime.toLocaleString() : "Selecionar início"}
          </Text>
        </TouchableOpacity>
        {showBeginTimePicker && (
          <DateTimePicker
            value={beginTime || new Date()}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowBeginTimePicker(false);
              if (selectedDate) setBeginTime(selectedDate);
            }}
          />
        )}
      </View>

      <View style={ExercicesStyle.inputGroup}>
        <Text style={ExercicesStyle.label}>Fim</Text>
        <TouchableOpacity
          style={ExercicesStyle.picker}
          onPress={() => setShowEndTimePicker(true)}
        >
          <Text style={endTime ? ExercicesStyle.pickerText : ExercicesStyle.pickerPlaceholder}>
            {endTime ? endTime.toLocaleString() : "Selecionar fim"}
          </Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime || new Date()}
            mode="datetime"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndTimePicker(false);
              if (selectedDate) setEndTime(selectedDate);
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
