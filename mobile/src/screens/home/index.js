import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Icon from "../../components/Icons";
import { Context } from "../../context/authContext";
import Toast from "react-native-toast-message";
import api from "../../api";
import Notifications from "./notifications";

const Home = ({ navigation }) => {
  const { user } = useContext(Context);
  const [userName, setUserName] = useState("");
  const [companionRequests, setCompanionRequests] = useState([]);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await user(onErrorToFetchUser);
      setUserName(userData.name);
    };
    const fetchCompanionRequests = async () => {
      try {
        const { data: companionRequests } = await api.get(
          "/companion-requests?type=received"
        );
        setCompanionRequests(
          companionRequests.filter((req) => req.status === "pending")
        );
      } catch (error) {
        console.error("Failed to fetch companion requests", error);
      }
    };
    fetchCompanionRequests();
    fetchUser();
  }, []);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFE18E" barStyle="dark-content" />
      <View style={styles.divWelcome}>
        <View style={styles.divUser}>
          <View style={styles.profileImg}>
            <View style={styles.divIconPeople}>
              <Icon.FontAwesome6
                name="people-arrows"
                size={20}
                color={"#000"}
              />
            </View>
          </View>
          <Text style={styles.textWelcome}>{userName}</Text>
        </View>

        <TouchableOpacity style={styles.bellContainer} onPress={() => setIsNotificationsVisible(true)}>
          <Icon.FontAwesome6 name="bell" size={20} color="#000" solid />
          {companionRequests.length > 0 && (
            <View
              style={{
                position: "absolute",
                right: 0,
                bottom: -10,
                backgroundColor: "red",
                width: 20,
                height: 20,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12 }}>
                {companionRequests.length}
              </Text>
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
        <TouchableOpacity
          style={styles.divOpt}
          onPress={() => navigation.navigate("Weighting")}
        >
          <Icon.FontAwesome6 name="weight-scale" size={40} color={"#000"} />
          <Text style={styles.textOpt}>Pesagem</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.divOpt}
          onPress={() => navigation.navigate("Consultations")}
        >
          <Icon.FontAwesome6 name="user-doctor" size={40} color={"#000"} />
          <Text style={styles.textOpt}>Consultas médicas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.divOpt}
          onPress={() => navigation.navigate("Measures")}
        >
          <Icon.MaterialCommunityIcons
            name="tape-measure"
            size={40}
            color={"#000"}
          />
          <Text style={styles.textOpt}>Medidas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.divOpt}
          onPress={() => navigation.navigate("Exercices")}
        >
          <Icon.FontAwesome6 name="dumbbell" size={40} color={"#000"} />
          <Text style={styles.textOpt}>Exercícios</Text>
        </TouchableOpacity>
      </ScrollView>
      <Notifications visible={isNotificationsVisible} onClose={() => setIsNotificationsVisible(false)} notifications={companionRequests}/>
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
    margin: 20,
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
});

export default Home;
