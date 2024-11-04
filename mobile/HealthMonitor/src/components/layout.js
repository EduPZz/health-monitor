import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icons from "./Icons";

const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight : 0;

const Layout = ({ goBackFunction, title, children }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#282828", "#ffcd43"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackFunction}
          >
            <Icons.Ionicons name="arrow-back" size={24} color={"#fff"} />
          </TouchableOpacity>
          <Text style={styles.title}>{ title }</Text>
        </View>
        {children}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: statusBarHeight + 32,
    paddingHorizontal: 16,
  },
  backButton: {
    zIndex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    left: 0,
    right: 0,
    top: statusBarHeight + 32,
    textAlign: "center",
  },
});

export default Layout;
