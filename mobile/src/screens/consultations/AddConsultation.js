import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import Layout from "../../components/layout";
import styles from "./styles";
import api from "../../api";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icons from "../../components/Icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddConsultation = ({ navigation }) => {
  const [consultationData, setConsultationData] = useState({
    doctorName: "",
    scheduleDate: new Date(),
    specialization: "",
    description: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const goBack = () => navigation.goBack();

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setConsultationData({
        ...consultationData,
        scheduleDate: selectedDate,
      });
    }
  };

  const handleInputChange = (field, value) => {
    setConsultationData({
      ...consultationData,
      [field]: value,
    });
  };

  const isFormValid = () => {
    return (
      consultationData.doctorName.trim() !== "" &&
      consultationData.specialization.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setIsLoading(true);
      await api.post("consultation", {
        ...consultationData,
        scheduleDate: consultationData.scheduleDate.toISOString(),
      });

      Alert.alert("Sucesso", "Consulta agendada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Failed to create consultation", error);
      Alert.alert(
        "Erro",
        "Não foi possível agendar a consulta. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout title="Nova Consulta" goBackFunction={goBack}>
      <KeyboardAwareScrollView
        style={styles.addContainer}
        contentContainerStyle={styles.addContentContainer}
        keyboardShouldPersistTaps="handled"
        extraHeight={100}
      >
        <View style={styles.addCard}>
          <Text style={styles.addCardTitle}>Informações da Consulta</Text>

          {/* Nome do Doutor */}
          <View style={styles.inputGroup}>
            <Icons.MaterialIcons
              name="person"
              size={20}
              color="#176B87"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Nome do doutor"
              placeholderTextColor="#aaa"
              value={consultationData.doctorName}
              onChangeText={(value) => handleInputChange("doctorName", value)}
              autoCapitalize="words"
            />
          </View>

          {/* Especialização */}
          <View style={styles.inputGroup}>
            <Icons.MaterialIcons
              name="medical-services"
              size={20}
              color="#176B87"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Especialização"
              placeholderTextColor="#aaa"
              value={consultationData.specialization}
              onChangeText={(value) =>
                handleInputChange("specialization", value)
              }
              autoCapitalize="words"
            />
          </View>

          {/* Data e Hora */}
          <View style={styles.inputGroup}>
            <Icons.MaterialIcons
              name="calendar-today"
              size={20}
              color="#176B87"
              style={styles.inputIcon}
            />
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              {showDatePicker && (
                <DateTimePicker
                  value={consultationData.scheduleDate}
                  mode="datetime"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
              {!showDatePicker && Platform.OS === "ios" && (
                <Text style={styles.dateTimeText}>
                  {formatDate(consultationData.scheduleDate)} às{" "}
                  {formatTime(consultationData.scheduleDate)}
                </Text>
              )}
              <Icons.MaterialIcons name="schedule" size={20} color="#176B87" />
            </TouchableOpacity>
          </View>

          {/* Descrição (Opcional) */}
          <View style={styles.inputGroup}>
            <Icons.MaterialIcons
              name="description"
              size={20}
              color="#176B87"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.inputField, styles.textArea]}
              placeholder="Descrição (opcional)"
              placeholderTextColor="#aaa"
              value={consultationData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Botão Salvar */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!isFormValid() || isLoading) && styles.buttonDisabled,
            ]}
            disabled={!isFormValid() || isLoading}
            onPress={handleSubmit}
          >
            {isLoading ? (
              <Text style={styles.saveButtonText}>Salvando...</Text>
            ) : (
              <Text style={styles.saveButtonText}>Agendar Consulta</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </Layout>
  );
};

export default AddConsultation;
