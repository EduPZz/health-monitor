// styles.js
import { StyleSheet, StatusBar, Platform } from "react-native";

const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

const smartwatchStyles = StyleSheet.create({
  background: {
    height: "100%",
    width: "100%",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: statusBarHeight + 32,
    paddingHorizontal: 16,
  },
  backButton: {
    zIndex: 1, // Ensures the back button is on top if needed
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    left: 0,
    right: 0,
    top: statusBarHeight + 32,
    textAlign: 'center',
  },
});

export default smartwatchStyles;
