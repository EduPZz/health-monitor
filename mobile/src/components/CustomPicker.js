import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

const CustomPicker = ({ label, options, selectedValue, onValueChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel =
    options.find((option) => option.value === selectedValue)?.label ||
    "Selecione";

  return (
    <View style={{ width: "100%" }}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.inputText}>{selectedLabel}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              ListFooterComponent={
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    fontFamily: "Poppins_400Regular",
  },
  inputBox: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  inputText: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Poppins_400Regular",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000077",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
  },
  option: {
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  cancelBtn: {
    marginTop: 16,
  },
  cancelText: {
    color: "#1976D2",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default CustomPicker;
