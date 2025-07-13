import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "../../components/Icons";
import styles from "./styles";
import { TextInput } from "react-native-gesture-handler";

export default function ConfirmRequest({
  onCancel,
  onSuccess,
  selectedUser,
  requestMode,
}) {
  const [message, setMessage] = useState("");
  const isSubmitButtonDisabled = !selectedUser;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {requestMode === "share"
          ? "Confirmar compartilhamento"
          : "Pedir compartilhamento"}
      </Text>
      <Text style={styles.description}>
        {requestMode === "share"
          ? "Você está prestes a compartilhar seu prontuário médico com esta pessoa."
          : "Você está pedindo para que esta pessoa compartilhe o prontuário médico com você."}
      </Text>
      <View style={styles.userInfo}>
        <View style={styles.iconCircle}>
          <Icon.FontAwesome5 name="user" size={16} color="#fff" />
        </View>
        <View
          style={{
            display: "flex",
            marginLeft: 10,
            flexDirection: "column",
          }}
        >
          <Text style={{ fontSize: 16 }}>{selectedUser.name}</Text>
          <Text style={styles.description}>{selectedUser.email}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.sectionText}>
          <Text style={styles.sectionTitle}>Mensagem (opcional)</Text>
          <TextInput
            style={{ ...styles.input, height: 60 }}
            placeholder="Escreva uma mensagem..."
            value={message}
            onChangeText={setMessage}
          />
        </View>
      </View>
      <TouchableOpacity
        style={{
          ...styles.primaryButton,
          backgroundColor: isSubmitButtonDisabled
            ? "grey"
            : styles.primaryButton.backgroundColor,
        }}
        onPress={() => onSuccess(selectedUser, message)}
        disabled={isSubmitButtonDisabled}
      >
        <Text style={styles.primaryButtonText}>
          {requestMode === "share" ? "Compartilhar" : "Pedir Compartilhamento"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
        <Text style={styles.secondaryButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}
