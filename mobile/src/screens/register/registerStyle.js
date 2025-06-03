import { Platform, StyleSheet } from "react-native";

const registerStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFCD43",
    },
    topSection: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFCD43",
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
        alignItems: "center"
    },
    registerTitle: {
       fontFamily: "Poppins_400Regular",
       fontSize: 38,
    },
    inputTitle: {
        fontFamily: "Poppins_400Regular",
        fontSize: 24,
        fontWeight: "600",
        letterSpacing: 1,
        marginTop: 35,
        marginBottom: 10
    },
    blocoInput: {
        width: '100%',
        paddingLeft: 7,
        paddingRight: 7,
        paddingTop: 5,
        borderBottomWidth: 2
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
        backgroundColor: '#000',
        borderRadius: 50,
        marginTop: 40
    },
    textEmphasis: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 8
    },
});

export default registerStyle;
