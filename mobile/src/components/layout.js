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
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackFunction}
          >
            <Icons.Ionicons name="chevron-back-outline" size={30} color={"#000"} />
          </TouchableOpacity>
          <Text style={styles.title}>{ title }</Text>
        </View>
        {children}
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
    backgroundColor: "#FFE18E"
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
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
});

export default Layout;
