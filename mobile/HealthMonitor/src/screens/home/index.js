import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Footer from "../../components/Footer";
import { LinearGradient } from "expo-linear-gradient";
import CurrentDate from "../../components/CurrentDate";
import Icon from "../../components/Icons";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#282828", "#ffcd43"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      >
        <View style={styles.divWelcome}>
          <Text style={styles.textWelcome}>Seja bem vindo!</Text>
          <CurrentDate />
        </View>
        <TouchableOpacity style={styles.divOpt}>
          <Icon.Ionicons name="watch-outline" size={40} color={"#000"} />
          <Text style={styles.textOpt}>Monitore seu corpo em tempo real</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.divOpt}>
          <Icon.MaterialCommunityIcons
            name="dumbbell"
            size={40}
            color={"#000"}
          />
          <Text style={styles.textOpt}>
            Registrar e acompanhar os exercícios físicos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.divOpt}>
          <Icon.MaterialCommunityIcons
            name="ruler-square-compass"
            size={40}
            color={"#000"}
          />
          <Text style={styles.textOpt}>Acompanhar suas medidas corporais</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.divOpt}>
          <Icon.Ionicons name="calendar-outline" size={40} color={"#000"} />
          <Text style={styles.textOpt}>Consultas marcadas</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    height: "100%",
    width: "100%",
  },
  divWelcome: {
    padding: "30px",
  },
  textWelcome: {
    color: "#fff",
    fontWeight: "600",
    fontSize: "18px",
    paddingBottom: "10px",
    fontFamily: "Arial",
  },
  divOpt: {
    marginTop: "15px",
    marginRight: "30px",
    marginBottom: "15px",
    marginLeft: "30px",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "110px",
    backgroundColor: "#FFF",
    borderRadius: "10px",
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
    fontSize: "16px",
    fontWeight: "600",
    textAlign: "center",
    width: "50%",
  },
});

export default Home;