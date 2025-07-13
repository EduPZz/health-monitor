import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Layout from "../../components/layout";
import Icon from "../../components/Icons"; // Supondo que você tenha um componente de ícones centralizado
import UserSearchModal from "../../components/UserSearchModal";
import styles from "./styles";
import ConfirmRequest from "./confirmRequest";

export default function ShareMedicalRecords({ navigation }) {
  const goBack = () => navigation.goBack();

  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState("share");
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <Layout title="Compartilhar prontuário médico" goBackFunction={goBack}>
      {!selectedUser && (
        <View style={styles.container}>
          <Text style={styles.title}>Compartilhar</Text>
          <Text style={styles.description}>
            Mantenha amigos, familiares e nutricionistas atualizados sobre sua
            saúde, compartilhando seus dados com segurança.
          </Text>

          <View style={styles.section}>
            <View style={styles.iconCircle}>
              <Icon.FontAwesome5 name="bell" size={20} color="#fff" />
            </View>
            <View style={styles.sectionText}>
              <Text style={styles.sectionTitle}>Painel e Notificações</Text>
              <Text style={styles.description}>
                As informações aparecem no app da outra pessoa, com notificações
                sobre atualizações.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.iconCircle}>
              <Icon.FontAwesome5 name="lock" size={20} color="#fff" />
            </View>
            <View style={styles.sectionText}>
              <Text style={styles.sectionTitle}>Privado e Seguro</Text>
              <Text style={styles.description}>
                Apenas um resumo é compartilhado. O compartilhamento pode ser
                interrompido a qualquer momento.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              setMode("share");
              setModalVisible(true);
            }}
          >
            <Text style={styles.primaryButtonText}>
              Compartilhar com alguém
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setMode("request");
              setModalVisible(true);
            }}
          >
            <Text style={styles.secondaryButtonText}>
              Pedir para alguém compartilhar
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedUser && (
        <ConfirmRequest
          onCancel={() => setSelectedUser(null)}
          onSuccess={(selectedUser, message) => { console.log("Request sent", selectedUser, message); }}
          selectedUser={selectedUser}
          requestMode={mode}
        />
      )}

      <UserSearchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        mode={mode}
        onSelect={handleSelectUser}
      />
    </Layout>
  );
}
