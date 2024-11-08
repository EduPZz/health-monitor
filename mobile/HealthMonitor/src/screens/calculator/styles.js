import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: "#1C1C1C",
    },
    background: {
        height: "100%",
        width: "100%",
        position: "absolute",
    },
    header: {
        color: "#FFF",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    inputSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    inputBox: {
        alignItems: "center",
    },
    label: {
        color: "#FFF",
        fontSize: 16,
        marginBottom: 5,
    },
    value: {
        color: "#FFF",
        fontSize: 18,
        borderBottomColor: "#FFF",
        borderBottomWidth: 1,
    },
    genderSection: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    separator: {
        width: 20,
        height: 2,
        backgroundColor: "#FFF",
        marginHorizontal: 10,
    },
    resultBox: {
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
