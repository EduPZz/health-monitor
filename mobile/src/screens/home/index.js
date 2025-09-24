import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Button,
  RefreshControl,
} from "react-native";
import Icon from "../../components/Icons";
import { Context } from "../../context/authContext";
import Toast from "react-native-toast-message";
import api from "../../api";
import Notifications from "./notifications";
import getInitials from "../../utils/getInitials";
import SkeletonCard from "../../components/SkeletonCard";
import useSocket from "../../hooks/useSocket";
import { useHomeData } from "../../hooks/useHomeData";
import HealthSummaryCard from "../../components/HealthSummaryCard";
import WeightTrendChart from "../../components/WeightTrendChart";
import UpcomingConsultationsCard from "../../components/UpcomingConsultationsCard";
import RecentExercisesCard from "../../components/RecentExercisesCard";
import BodyMeasuresCard from "../../components/BodyMeasuresCard";
import WeightSummaryCard from "../../components/WeightSummaryCard";

const Home = ({ navigation }) => {
  const { user, logout } = useContext(Context);
  const [userName, setUserName] = useState("");
  const [companionRequests, setCompanionRequests] = useState([]);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);

  // Use the new home data hook
  const { data, loading, error, refreshData } = useHomeData();

  const onErrorToFetchUser = (error) => {
    console.error("Failed to fetch user", error);
    if (error) {
      navigation.navigate("Login");
    }
    Toast.show({
      type: "error",
      text1: "Erro",
      text2: "Erro ao carregar usuário",
    });
  };

  const disconnect = async () => {
    try {
      await logout();
      Toast.show({
        type: "success",
        text1: "Desconectado",
        text2: "Você foi desconectado com sucesso.",
      });
      navigation.navigate("Login");
    } catch (error) {
      console.error("Failed to disconnect", error);
      Toast.show({
        type: "error",
        text1: "Erro ao desconectar",
        text2:
          error.response?.data?.message ||
          "Ocorreu um erro ao tentar se desconectar.",
      });
    }
  };

  const fetchData = async () => {
    try {
      const userData = await user(onErrorToFetchUser);
      setUserName(userData.name);

      const { data: companionRequests } = await api.get(
        "/companion-requests?type=received"
      );
      setCompanionRequests(
        companionRequests.filter((req) => req.status === "pending")
      );
    } catch (error) {
      console.error("Failed to load data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  useSocket({
    onCompanionRequest: (data) => {
      setCompanionRequests((prev) => {
        if (prev.some((req) => req.id === data.id)) return prev;
        return [data, ...prev];
      });
    },
  });

  const renderDataCards = () => {
    return (
      <>
        <HealthSummaryCard data={data} />
        <WeightSummaryCard
          weightData={data.bodyMeasures}
          onPress={() => navigation.navigate("ConnectScale")}
        />
        <BodyMeasuresCard
          measures={data.bodyMeasures}
          onPress={() => navigation.navigate("Measures")}
          onAddNew={() => navigation.navigate("Measures")}
        />
        <UpcomingConsultationsCard
          consultations={data.upcomingConsultations}
          onPress={() => navigation.navigate("Consultations")}
          onAddNew={() => navigation.navigate("Consultations")}
        />
        <RecentExercisesCard
          exercises={data.recentExercises}
          onPress={() => navigation.navigate("Exercices")}
          onAddNew={() => navigation.navigate("Exercices")}
        />
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Ações Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate("ConnectScale")}
            >
              <Icon.FontAwesome6
                name="weight-scale"
                size={24}
                color="#4CAF50"
              />
              <Text style={styles.quickActionText}>Nova Pesagem</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate("Measures")}
            >
              <Icon.MaterialCommunityIcons
                name="tape-measure"
                size={24}
                color="#FF9800"
              />
              <Text style={styles.quickActionText}>Nova Medida</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate("Exercices")}
            >
              <Icon.FontAwesome6 name="dumbbell" size={24} color="#9C27B0" />
              <Text style={styles.quickActionText}>Novo Exercício</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate("Consultations")}
            >
              <Icon.FontAwesome6 name="user-doctor" size={24} color="#2196F3" />
              <Text style={styles.quickActionText}>Nova Consulta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#979797ff" barStyle="dark-content" />
      <View style={styles.divWelcome}>
        <View style={styles.userInfo}>
          <View style={styles.divUser}>
            <Text style={styles.initials}>{getInitials(userName)}</Text>
          </View>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{userName}</Text>
        </View>
        <TouchableOpacity
          style={styles.bellContainer}
          onPress={() => setIsNotificationsVisible(true)}
        >
          <Icon.FontAwesome6 name="bell" size={20} color="#E4F1FE" solid />
          {companionRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{companionRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshData} />
        }
      >
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          renderDataCards()
        )}

        <Button title="Desconectar" onPress={disconnect} />
      </ScrollView>

      <Notifications
        visible={isNotificationsVisible}
        onClose={() => setIsNotificationsVisible(false)}
        notifications={companionRequests}
        actionCallback={() => {
          setIsNotificationsVisible(false);
          fetchData();
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEF5FF",
    fontFamily: "Roboto",
  },
  bellContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#176B87",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  background: {
    height: "100%",
    width: "100%",
  },
  divUser: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#176B87",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 40,
  },
  profileImg: {
    width: 65,
    height: 65,
    borderRadius: "50%",
    backgroundColor: "#22313F",
    marginRight: 8,
  },
  divIconPeople: {
    backgroundColor: "#FFF",
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
  },
  divWelcome: {
    paddingHorizontal: 24,
    paddingBottom: 8,
    paddingTop: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textWelcome: {
    color: "#22313F",
    fontWeight: "600",
    fontSize: 16,
  },
  divOpt: {
    marginTop: 15,
    marginRight: 30,
    marginBottom: 15,
    marginLeft: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 110,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#22313F",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  textOpt: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    width: "50%",
  },
  divAddBalance: {
    marginHorizontal: 24,
    backgroundColor: "#FFF",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    padding: 20,
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    padding: 30,
  },
  btnAddBalance: {
    backgroundColor: "#93DA97",
    height: 50,
    borderRadius: 30,
    width: "90%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  textBtn: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  badge: {
    position: "absolute",
    right: 0,
    bottom: -10,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  quickActionsContainer: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#22313F",
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionButton: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#22313F",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#22313F",
    marginTop: 8,
    textAlign: "center",
  },
});

export default Home;
