import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import Layout from "../../components/layout";
import styles from "./styles";
import api from "../../api";
import Icons from "../../components/Icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddMeasurementEvent = ({ navigation, route }) => {
  const eventId = route?.params?.eventId;
  const existingEvent = route?.params?.event;
  const isEditMode = !!eventId;

  const [eventData, setEventData] = useState({
    name: existingEvent?.name || "",
    description: existingEvent?.description || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const goBack = () => navigation.goBack();

  const handleInputChange = (field, value) => {
    setEventData({
      ...eventData,
      [field]: value,
    });
  };

  const isFormValid = () => {
    return eventData.name.trim() !== "";
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      Alert.alert("Erro", "Por favor, preencha o nome do evento.");
      return;
    }

    try {
      setIsLoading(true);
      if (isEditMode) {
        await api.patch(`measurement-events/${eventId}`, eventData);
        Alert.alert("Sucesso", "Evento atualizado com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        await api.post("measurement-events", eventData);
        Alert.alert("Sucesso", "Evento criado com sucesso!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to save event", error);
      Alert.alert(
        "Erro",
        `Não foi possível ${isEditMode ? "atualizar" : "criar"} o evento. Tente novamente.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title={isEditMode ? "Editar Evento" : "Novo Evento"} goBackFunction={goBack}>
      <KeyboardAwareScrollView
        style={styles.addContainer}
        contentContainerStyle={styles.addContentContainer}
        keyboardShouldPersistTaps="handled"
        extraHeight={100}
      >
        <View style={styles.addCard}>
          <Text style={styles.addCardTitle}>Informações do Evento</Text>

          {/* Nome do Evento */}
          <View style={styles.inputGroup}>
            <Icons.MaterialIcons
              name="event"
              size={20}
              color="#176B87"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.inputField}
              placeholder="Nome do evento"
              placeholderTextColor="#aaa"
              value={eventData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              autoCapitalize="words"
            />
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
              value={eventData.description}
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
              <Text style={styles.saveButtonText}>
                {isEditMode ? "Atualizar Evento" : "Criar Evento"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </Layout>
  );
};

export default AddMeasurementEvent;

