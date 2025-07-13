import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Layout from "../../components/layout";
import Icon from "../../components/Icons"; // Supondo que você tenha um componente de ícones centralizado
import UserSearchModal from "../../components/UserSearchModal";

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
        <View style={styles.container}>
          <Text style={styles.title}>{mode === "share" ? "Confirmar compartilhamento" : "Pedir compartilhamento"}</Text>
          <Text style={styles.description}>
            {mode === "share"
              ? "Você está prestes a compartilhar seu prontuário médico com esta pessoa."
              : "Você está pedindo para que esta pessoa compartilhe o prontuário médico com você."}
          </Text>
          <View style={styles.userInfo}>
            <View
              style={styles.iconCircle}
            >
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
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              navigation.navigate("Home");
            }}
          >
            <Text style={styles.primaryButtonText}>
              {mode === "share" ? "Compartilhar" : "Pedir Compartilhamento"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setSelectedUser(null);
            }}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
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

const styles = StyleSheet.create({
  container: {
    gap: 20,
    margin: 20,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  section: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  iconCircle: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 3,
  },
  sectionText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    marginTop: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
});
