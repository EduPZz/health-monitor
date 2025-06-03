import { StyleSheet, StatusBar, Platform } from "react-native";

const statusBarHeight = Platform.OS === "android" ? StatusBar.currentHeight : 0;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE18E"
  },
  background: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  header: {
    paddingTop: statusBarHeight + 32,
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputSection: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    gap: 8,
  },
  inputBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  value: {
    color: "#FFF",
    fontSize: 18,
    borderBottomColor: "#FFF",
    borderBottomWidth: 2,
    paddingBottom: 5,
    width: 60,
    textAlign: "center",
  },
  genderSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  separator: {
    width: 2,
    height: 30,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
  },
  resultBox: {
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  resultTitle: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 10,
  },
  bmiValue: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  statusBox: {
    backgroundColor: "#CFF4D2",
    borderRadius: 5,
    padding: 5,
    marginTop: 10,
  },
  statusText: {
    color: "#333",
    fontSize: 14,
  },
  rangeBar: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  gradientBar: {
    height: 8,
    width: "90%",
    borderRadius: 4,
  },
  pointer: {
    position: "absolute",
    top: -5,
    left: "50%",
    width: 10,
    height: 10,
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#333",
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 5,
  },
  rangeLabel: {
    color: "#FFF",
    fontSize: 12,
  },
});

export default style;
