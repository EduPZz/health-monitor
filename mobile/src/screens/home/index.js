import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Icon from "../../components/Icons";
import { Context } from "../../context/authContext";
import Toast from "react-native-toast-message";
import api from "../../api";
import Notifications from "./notifications";
import getInitials from "../../utils/getInitials";
import SkeletonCard from "../../components/SkeletonCard";

const Home = ({ navigation }) => {
  const { user } = useContext(Context);
  const [userName, setUserName] = useState("");
  const [companionRequests, setCompanionRequests] = useState([]);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCard = (icon, text, screen, iconPack = "FontAwesome6") => {
    const IconComponent = Icon[iconPack];
    return (
      <TouchableOpacity
        style={styles.divOpt}
        onPress={() => navigation.navigate(screen)}
      >
        <IconComponent name={icon} size={40} color={"#000"} />
        <Text style={styles.textOpt}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFE18E" barStyle="dark-content" />
      <View style={styles.divWelcome}>
        <View style={styles.userInfo}>
          <View style={styles.divUser}>
            <Text style={styles.initials}>{getInitials(userName)}</Text>
          </View>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{userName}</Text>
        </View>
        <TouchableOpacity
          style={styles.bellContainer}
          onPress={() => setIsNotificationsVisible(true)}
        >
          <Icon.FontAwesome6 name="bell" size={20} color="#000" solid />
          {companionRequests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{companionRequests.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.divAddBalance}>
          <Icon.FontAwesome6 name="weight-scale" size={60} color={"#F5B041"} />
          <Text style={styles.subtitle}>
            Bem-vindo! Por favor, adicione um dispositivo primeiro
          </Text>
          <TouchableOpacity
            style={styles.btnAddBalance}
            onPress={() => navigation.navigate("ConnectScale")}
          >
            <Text style={styles.textBtn}>Conectar dispositivo</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {renderCard("weight-scale", "Pesagem", "Weighting")}
            {renderCard("user-doctor", "Consultas médicas", "Consultations")}
            {renderCard(
              "tape-measure",
              "Medidas",
              "Measures",
              "MaterialCommunityIcons"
            )}
            {renderCard("dumbbell", "Exercícios", "Exercices")}
          </>
        )}
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
    backgroundColor: "#FFE18E",
    fontFamily: "Roboto",
  },
  bellContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
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
    backgroundColor: "#ED702F",
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
    backgroundColor: "#000",
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
    color: "#000",
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
    shadowColor: "#000",
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
    height: 250,
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
    backgroundColor: "#F5B041",
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
});

export default Home;
