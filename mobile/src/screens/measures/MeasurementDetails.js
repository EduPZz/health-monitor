import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icons from "../../components/Icons";

const MeasurementDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { measurement } = route.params;

  // Função para calcular peso ótimo baseado na altura (IMC 18.5 - 24.9)
  const getOptimalWeightRange = (height) => {
    if (!height) return null;
    return {
      min: parseFloat((18.5 * height * height).toFixed(1)),
      max: parseFloat((24.9 * height * height).toFixed(1)),
    };
  };

  const getStatusColor = (value, range) => {
    if (!value || !range) return "#ccc";
    if (value >= range.min && value <= range.max) return "#4CAF50"; // Ótimo
    if (value < range.min) return "#FF9800"; // Abaixo
    return "#F44336"; // Acima
  };

  const getStatusText = (value, range) => {
    if (!value || !range) return "N/A";
    if (value >= range.min && value <= range.max) return "Ótimo";
    if (value < range.min) return "Abaixo";
    return "Acima";
  };

  const renderMeasurementRuler = (label, value, range, unit, icon) => {
    const statusColor = getStatusColor(value, range);
    const statusText = getStatusText(value, range);

    return (
      <View style={styles.measurementCard}>
        <View style={styles.measurementHeader}>
          <View style={styles.labelContainer}>
            {icon}
            <Text style={styles.measurementLabel}>{label}</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.measurementValue}>
              {value ? `${value} ${unit}` : "N/A"}
            </Text>
            {range && (
              <View
                style={[styles.statusBadge, { backgroundColor: statusColor }]}
              >
                <Text style={styles.statusText}>{statusText}</Text>
              </View>
            )}
          </View>
        </View>

        {value && range && (
          <View style={styles.rulerContainer}>
            <View style={styles.ruler}>
              <View style={styles.rulerTrack}>
                <View style={styles.rulerFill} />
                <View
                  style={[
                    styles.rulerMarker,
                    {
                      left: `${Math.min(
                        Math.max(
                          ((value - range.min) / (range.max - range.min)) * 100,
                          0
                        ),
                        100
                      )}%`,
                      backgroundColor: statusColor,
                    },
                  ]}
                />
              </View>
              <View style={styles.rulerLabels}>
                <Text style={styles.rulerLabel}>{range.min}</Text>
                <Text style={styles.rulerLabel}>{range.max}</Text>
              </View>
            </View>
            <Text style={styles.optimalRange}>
              Faixa ótima: {range.min} - {range.max} {unit}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icons.Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Medida</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.dateSection}>
          <Text style={styles.dateTitle}>Data da Medição</Text>
          <Text style={styles.dateText}>
            {new Date(measurement.createdAt).toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <Text style={styles.timeText}>
            {new Date(measurement.createdAt).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.measurementsContainer}>
          {renderMeasurementRuler(
            "Peso",
            measurement.weight,
            getOptimalWeightRange(measurement.height),
            "kg",
            <Icons.FontAwesome6 name="weight-scale" size={20} color="#1976D2" />
          )}

          {renderMeasurementRuler(
            "Altura",
            measurement.height,
            null, // sem faixa ótima
            "m",
            <Icons.FontAwesome6 name="ruler" size={20} color="#1976D2" />
          )}

          {renderMeasurementRuler(
            "Circunferência do Tórax",
            measurement.chest,
            null,
            "cm",
            <Icons.FontAwesome6 name="circle" size={20} color="#1976D2" />
          )}

          {renderMeasurementRuler(
            "Circunferência do Braço",
            measurement.arm,
            null,
            "cm",
            <Icons.FontAwesome6 name="circle" size={20} color="#1976D2" />
          )}

          {renderMeasurementRuler(
            "Circunferência da Cintura",
            measurement.waist,
            null,
            "cm",
            <Icons.FontAwesome6 name="circle" size={20} color="#1976D2" />
          )}

          {renderMeasurementRuler(
            "Circunferência da Coxa",
            measurement.thigh,
            null,
            "cm",
            <Icons.FontAwesome6 name="circle" size={20} color="#1976D2" />
          )}

          {renderMeasurementRuler(
            "Circunferência do Quadril",
            measurement.hip,
            null,
            "cm",
            <Icons.FontAwesome6 name="circle" size={20} color="#1976D2" />
          )}

          {renderMeasurementRuler(
            "Circunferência da Panturrilha",
            measurement.calf,
            null,
            "cm",
            <Icons.FontAwesome6 name="circle" size={20} color="#1976D2" />
          )}
        </View>

        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Legenda</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#4CAF50" }]} />
              <Text style={styles.legendText}>Ótimo</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#FF9800" }]} />
              <Text style={styles.legendText}>Abaixo do ideal</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#F44336" }]} />
              <Text style={styles.legendText}>Acima do ideal</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // mantém os estilos originais
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  placeholder: { width: 40 },
  content: { flex: 1 },
  dateSection: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  dateTitle: { fontSize: 16, fontWeight: "600", color: "#666", marginBottom: 8 },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  timeText: { fontSize: 14, color: "#666" },
  measurementsContainer: { padding: 20 },
  measurementCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  measurementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  labelContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  measurementLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 12,
  },
  valueContainer: { alignItems: "flex-end" },
  measurementValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  rulerContainer: { marginTop: 8 },
  ruler: { marginBottom: 8 },
  rulerTrack: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    position: "relative",
    marginBottom: 8,
  },
  rulerFill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#e8f5e8",
    borderRadius: 4,
  },
  rulerMarker: {
    position: "absolute",
    top: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rulerLabels: { flexDirection: "row", justifyContent: "space-between" },
  rulerLabel: { fontSize: 12, color: "#666" },
  optimalRange: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  legendContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
  },
  legendItems: { gap: 12 },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: { fontSize: 14, color: "#666" },
});

export default MeasurementDetails;
