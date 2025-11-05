import React, { useState, useEffect, useContext } from "react";
import VerticalModal from "../../components/VerticalModal";
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import Icons from "../../components/Icons";
import { Context } from "../../context/authContext";
import getInitials from "../../utils/getInitials";
import Toast from "react-native-toast-message";

export default function UserProfile({ visible, onClose, onLogout }) {
  const { user } = useContext(Context);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      fetchUserData();
    }
  }, [visible]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const onErrorToFetchUser = (error) => {
        console.error("Failed to fetch user", error);
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Erro ao carregar informações do usuário",
        });
      };
      const userInfo = await user(onErrorToFetchUser);
      setUserData(userInfo);
    } catch (error) {
      console.error("Failed to load user data", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  const formatSex = (sex) => {
    if (!sex) return "Não informado";
    const sexMap = {
      male: "Masculino",
      female: "Feminino",
    };
    return sexMap[sex] || sex;
  };

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  return (
    <VerticalModal
      onClose={onClose}
      visible={visible}
      title="Perfil do Usuário"
      swipeEnabled={true}
      height="60%"
    >
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        ) : userData ? (
          <View style={styles.container}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImg}>
                <Text style={styles.initials}>
                  {getInitials(userData.name || "U")}
                </Text>
              </View>
              <Text style={styles.name}>{userData.name || "Usuário"}</Text>
            </View>

            <View style={styles.infoSection}>

              <View style={styles.infoRow}>
                <Icons.MaterialIcons
                  name="person"
                  size={20}
                  color="#176B87"
                  style={styles.icon}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Sexo</Text>
                  <Text style={styles.infoValue}>
                    {formatSex(userData.sex)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Icons.MaterialIcons
                  name="cake"
                  size={20}
                  color="#176B87"
                  style={styles.icon}
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Data de Nascimento</Text>
                  <Text style={styles.infoValue}>
                    {formatDate(userData.birthDate)}
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Icons.MaterialIcons
                name="logout"
                size={20}
                color="#fff"
                style={styles.logoutIcon}
              />
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Erro ao carregar informações do usuário
            </Text>
          </View>
        )}
      </ScrollView>
    </VerticalModal>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#f00",
    textAlign: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profileImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#176B87",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  initials: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#22313F",
  },
  infoSection: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#22313F",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

