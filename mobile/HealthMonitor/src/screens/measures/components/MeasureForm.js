import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const MeasureForm = ({
  title,
  stylesFromProp,
  measurements,
  setMeasurements,
  onSave,
  onCancel,
}) => {
  const handleInputChange = (field, value) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  const isSaveDisabled = Object.values(measurements).some((m) => !m);

  const measurementFields = [
    { label: "Peito (cm)", field: "chest", placeholder: "Ex: 100" },
    { label: "Braço (cm)", field: "arm", placeholder: "Ex: 30" },
    { label: "Cintura (cm)", field: "waist", placeholder: "Ex: 60" },
    { label: "Coxa (cm)", field: "thigh", placeholder: "Ex: 40" },
    { label: "Quadril (cm)", field: "hip", placeholder: "Ex: 30" },
    { label: "Panturrilha (cm)", field: "calf", placeholder: "Ex: 20" },
    { label: "Peso (kg)", field: "weight", placeholder: "Ex: 70" },
    { label: "Altura (metros)", field: "height", placeholder: "Ex: 1.87" },
  ];

  return (
    <View style={[styles.container, stylesFromProp]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        extraHeight={100}
      >
        <Text style={styles.title}>{title}</Text>

        <View style={styles.inputContainer}>
          {measurementFields.map(({ label, field, placeholder }) => (
            <View style={styles.inputBox} key={field}>
              <Text style={styles.inputLabel}>{label}</Text>
              <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={measurements[field].toString()}
                keyboardType="numeric"
                onChangeText={(value) => handleInputChange(field, +value)}
              />
            </View>
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonSave,
              isSaveDisabled && styles.buttonSaveDisabled,
            ]}
            onPress={onSave}
            disabled={isSaveDisabled}
          >
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  title: {
    marginTop: 32,
    fontSize: 20,
    color: "#303030",
    fontWeight: "bold",
    textAlign: "center",
  },
  inputContainer: {
    marginTop: 24,
    marginBottom: 32,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  inputBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  inputLabel: {
    color: "#5F5F5F",
    fontSize: 16,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 18,
  },
  buttonCancel: {
    justifyContent: "center",
    backgroundColor: "#7E7B7B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlign: "center",
    borderRadius: 12,
  },
  buttonSave: {
    justifyContent: "center",
    backgroundColor: "#E2B740",
    paddingVertical: 8,
    paddingHorizontal: 16,
    textAlign: "center",
    borderRadius: 12,
  },
  buttonSaveDisabled: {
    backgroundColor: "#BDBDBD",
  },
  buttonText: {
    color: "#fff",
  },
});

export default MeasureForm;
