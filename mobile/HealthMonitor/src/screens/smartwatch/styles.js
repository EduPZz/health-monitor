import { StyleSheet } from "react-native";

const smartwatchStyles = StyleSheet.create({
  container: {
    display: "flex",
    marginTop: 16,
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#FFF",
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#4A4949",
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    color: "#FFF",
    paddingVertical: 10,
    height: 40,
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default smartwatchStyles;
