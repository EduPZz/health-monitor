import { Platform, StyleSheet } from "react-native";

const registerStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF5FF",
    },
    topSection: {
        flex: 1,
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
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        gap: 16
    },
    registerTitle: {
       fontFamily: "Poppins_400Regular",
        fontSize: 26,

    },
    inputTitle: {
        fontFamily: "Poppins_400Regular",
        fontSize: 16,
        fontWeight: "600",
        letterSpacing: 1
    },
    blocoInput: {
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
    input: {
        fontFamily: "Poppins_400Regular",
        fontSize: 16,
        width: '75%'
    },
    textButtom: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 1.6,
        color: '#ffffff'
    },
    registerButtom: {
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1976D2',
        borderRadius: 50
    },
    textEmphasis: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        fontWeight: 'bold'
    },
});

export default registerStyle;
