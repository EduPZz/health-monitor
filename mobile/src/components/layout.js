import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import Icons from "./Icons";

const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight : 0;

const Layout = ({ goBackFunction, title, children }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { paddingTop: statusBarHeight }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackFunction}
          >
            <Icons.Ionicons name="chevron-back-outline" size={30} color={"#000"} />
          </TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
        </View>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFE18E",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
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
