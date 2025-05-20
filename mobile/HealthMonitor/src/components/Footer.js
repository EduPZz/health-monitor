import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Footer = () => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => alert("Home")}>
        <Icon name="home" size={25} color={"#000"} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => alert("Calculadora")}>
        <Icon name="calculator" size={25} color={"#000"} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    alignItems: 'center',
    position: "absolute",
    bottom: 0,
    padding: 10,
    height: 100,
    width: "100%",
  },
});

export default Footer;
