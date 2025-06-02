import { View, StyleSheet, Text } from "react-native";
import Layout from "../../components/layout";

const Weighting = ({ navigation }) => {
    const goBack = () => navigation.goBack();

    return(
        <Layout goBackFunction={goBack} title={"Pesagem"}>
            <View style={styles.mainContainer}>
                <View style={styles.divWeight}>
                    <Text style={styles.textWeight}>
                        0.00
                    </Text>
                    <Text style={styles.textKg}>
                        Kg
                    </Text>
                </View>
                <View style={styles.divDatas}>
                    <View style={styles.divData}>
                        <Text style={styles.textTitleData}>Imc</Text>
                        <Text style={styles.textResultData}>--</Text>
                    </View>
                    <View style={styles.divData}>
                        <Text style={styles.textTitleData}>Gordura corporal</Text>
                        <Text style={styles.textResultData}>--</Text>
                    </View>
                    <View style={styles.divData}>
                        <Text style={styles.textTitleData}>Água</Text>
                        <Text style={styles.textResultData}>--</Text>
                    </View>
                    <View style={styles.divData}>
                        <Text style={styles.textTitleData}>Massa muscular</Text>
                        <Text style={styles.textResultData}>--</Text>
                    </View>
                </View>
            </View>
        </Layout>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#FFE18E",
        fontFamily: "Roboto",
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
    },
    divWeight: {
        marginTop: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5B041",
        height: 200,
        width: 200,
        borderRadius: "50%",
    },
    textWeight: {
        fontWeight: "bold",
        fontSize: 40,
        color: "#FFF",

    },
    textKg: {
        color: "#FFF",
        position: "absolute",
        bottom: 20,
        fontWeight: "bold",
        fontSize: 20,
    },
    divDatas: {
        marginTop: 40,
        borderRadius: 10,
        backgroundColor: "#FFF",
        width: "90%",
    },
    divData: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        padding: 30,
        borderBottomWidth: 1,
        borderBottomColor: "#E3E3E3"
    },
    textTitleData: {
        fontSize: 16,
        fontWeight: "bold",
    },
})

export default Weighting;