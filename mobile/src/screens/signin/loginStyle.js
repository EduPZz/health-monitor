import { Platform, StyleSheet } from "react-native";

const loginStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF5FF",
    },
    topSection: {
        flex: 0.4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EEF5FF",
    },
    containerAction: {
        width: '100%',
        padding: 50,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 45,
        borderTopRightRadius: 45,
        flex: 0.6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        ...Platform.select({
            android: {
                elevation: 13
            }
        }),
        alignItems: "center",
        display: "flex",
        gap: 16,
    },
    loginTitle: {
        fontFamily: "Inter_400Regular",
        fontSize: 38,
    },
    inputTitle: {
        fontFamily: "Inter_400Regular",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 1,
    },
    blocoInput: {
        width: '100%',
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 5,
        borderBottomWidth: 2
    },
    input: {
        fontFamily: "Inter_400Regular",
        fontSize: 16,
        width: '75%'
    },
    textEmphasis: {
        fontFamily: 'Inter_400Regular',
        fontSize: 15,
        fontWeight: 'bold',
    },
    loginButtom: {
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1976D2',
        borderRadius: 50,
    },
    textButtom: {
        fontFamily: 'Inter_400Regular',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 1.6,
        color: '#ffffff'
    },
    welcomeTitle: {
        fontSize: 26,
        textAlign: "center",
    },
    subtitle: {
        fontFamily: "Inter_400Regular",
        fontSize: 16,
        textAlign: "center",
        color: "#666",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === "ios" ? 14 : 8,
        backgroundColor: "#fff",
        width: '100%',
    },
});

export default loginStyle;
