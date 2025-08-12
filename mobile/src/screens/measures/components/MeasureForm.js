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
    const normalized = value.replace(",", ".");
    setMeasurements((prev) => ({ ...prev, [field]: normalized }));
  };

  const isSaveDisabled = Object.values(measurements).some((m) => m === "");

  const measurementFields = [
    { label: "Peito (cm)", field: "chest", placeholder: "Ex: 100" },
    { label: "Braço (cm)", field: "arm", placeholder: "Ex: 30" },
    { label: "Cintura (cm)", field: "waist", placeholder: "Ex: 60" },
    { label: "Coxa (cm)", field: "thigh", placeholder: "Ex: 40" },
    { label: "Quadril (cm)", field: "hip", placeholder: "Ex: 30" },
    { label: "Panturrilha (cm)", field: "calf", placeholder: "Ex: 20" },
    { label: "Peso (kg)", field: "weight", placeholder: "Ex: 70" },
    { label: "Altura (m)", field: "height", placeholder: "Ex: 1.87" },
  ];

  return (
    <View style={[styles.container, stylesFromProp]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        extraHeight={100}
      >
        <Text style={styles.title}>{title}</Text>

        {measurementFields.map(({ label, field, placeholder }) => (
          <View style={styles.inputGroup} key={field}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              value={measurements[field]?.toString() || ""}
              keyboardType="numeric"
              onChangeText={(value) => handleInputChange(field, value)}
            />
          </View>
        ))}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.buttonCancel} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonSave, isSaveDisabled && styles.buttonDisabled]}
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
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#303030",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#5F5F5F",
    fontSize: 15,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#303030",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: "#7E7B7B",
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    alignItems: "center",
  },
  buttonSave: {
    flex: 1,
    backgroundColor: "#E2B740",
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#BDBDBD",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default MeasureForm;
