import { StyleSheet } from "react-native";

const ExercicesStyle = StyleSheet.create({
    containerGrafico: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 17,
        marginTop: 30,
        paddingHorizontal: 20,
        paddingVertical: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        alignItems: 'center',
    },
    textTitles: {
        fontSize: 16,
        letterSpacing: 0.7,
        fontWeight: '600',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    legendColor: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    legendText: {
        fontSize: 14,
        color: '#666',
    },
    addExerciseContainer: {
        width: '90%',
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        marginTop: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 16
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    picker: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#B0B0B0',
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    pickerText: {
        color: '#333333',
        fontSize: 16,
        textAlign: 'center',
    },
    pickerPlaceholder: {
        color: '#888888',
        fontSize: 16,
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#FFCD43',
        borderRadius: 50,
        width: 200,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    addText:{
        fontSize: 22,
        fontWeight: '600',
        color: '#FFFFFF'

    },
    miniCard: {
        position: 'absolute',
        padding: 8,
        backgroundColor: '#333',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        maxWidth: 60,
        alignItems: 'center',
    },
    miniCardText: {
        color: '#fff',
        fontSize: 12,
    },
    miniCardArrow: {
        position: 'absolute',
        bottom: -5,
        width: 0,
        height: 0,
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderTopWidth: 5,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#333',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    legendColor: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    legendText: {
        fontSize: 14,
        color: '#666',
    },
});

export default ExercicesStyle;
