import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import CurrentDate from "../../components/CurrentDate";
import Icon from "../../components/Icons";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <View style={styles.divWelcome}>
          <View style={styles.divUser}>
            <View style={styles.profileImg}>
              <View style={styles.divIconPeople}>
                <Icon.FontAwesome6 name="people-arrows" size={20} color={"#000"} />
              </View>
            </View>
            <Text style={styles.textWelcome}>Name User</Text>
          </View>
          <Icon.FontAwesome6 name="bell" size={30} color={"#000"} />
        </View>
        <View style={styles.divAddBalance}>
          <Icon.FontAwesome6 name="weight-scale" size={60} color={"#F5B041"} />
          <Text style={styles.subtitle}>Bem-vindo! Por favor, adicione um dispositivo primeiro</Text>
          <TouchableOpacity style={styles.btnAddBalance} onPress={() => navigation.navigate("Smartwatch")}>
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
          <Icon.MaterialCommunityIcons name="tape-measure" size={40} color={"#000"} />
          <Text style={styles.textOpt}>Medidas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.divOpt}
          onPress={() => navigation.navigate("Exercices")}
        >
          <Icon.FontAwesome6 name="dumbbell" size={40} color={"#000"} />
          <Text style={styles.textOpt}>Exercicios</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE18E",
    fontFamily: "Roboto"
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
    marginRight: 20,
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
    borderRadius: "50%"
  },
  divWelcome: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
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
    padding: 30
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
    fontSize: 16
  }
});

export default Home;
