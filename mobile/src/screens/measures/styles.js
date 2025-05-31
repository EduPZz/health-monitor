import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  form: {
    marginTop: 32,
    marginHorizontal: 24,
  },
  measurementGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 16,
  },
  measurementCard: {
    width: "45%",
    padding: 16,
    margin: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  measurementLabel: {
    fontSize: 16,
    color: "#5F5F5F",
    textAlign: "center",
  },
  measurementValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#303030",
  },
  increaseIndicator: {
    color: "red",
  },
  decreaseIndicator: {
    color: "green",
  },
  editButton: {
    backgroundColor: "#5F5F5F",
    borderRadius: 8,
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    width: 'fit-content',
    margin: 24
  },
  editButtonLabel: {
    color: "#fff",
  },
});

export default styles;
