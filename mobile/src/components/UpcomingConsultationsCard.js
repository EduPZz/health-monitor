import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "./Icons";
import { getDaysUntil } from "../utils/dateUtil";

const UpcomingConsultationsCard = ({ consultations, onPress, onAddNew }) => {
  if (!consultations || consultations.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon.FontAwesome6 name="user-doctor" size={24} color="#2196F3" />
          <Text style={styles.title}>Próximas Consultas</Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma consulta agendada</Text>
          <Text style={styles.emptySubtext}>
            Agende sua primeira consulta médica
          </Text>

          <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
            <Icon.FontAwesome6 name="plus" size={16} color="#FFF" />
            <Text style={styles.addButtonText}>Agendar Consulta</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon.FontAwesome6 name="user-doctor" size={24} color="#2196F3" />
        <Text style={styles.title}>Próximas Consultas</Text>
        <TouchableOpacity style={styles.addIconButton} onPress={onAddNew}>
          <Icon.FontAwesome6 name="plus" size={16} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <View style={styles.consultationsList}>
        {consultations.slice(0, 3).map((consultation, index) => (
          <View key={consultation.id || index} style={styles.consultationItem}>
            <View style={styles.consultationInfo}>
              <Text style={styles.doctorName}>
                {consultation.doctorName || "Dr. Nome não informado"}
              </Text>
              <Text style={styles.specialty}>
                {consultation.specialization || "Especialidade não informada"}
              </Text>
              <View style={styles.dateTimeContainer}>
                <Icon.FontAwesome6 name="calendar" size={12} color="#666" />
                <Text style={styles.dateTime}>
                  {formatDate(consultation.scheduleDate)} às{" "}
                  {formatTime(consultation.scheduleDate)}
                </Text>
              </View>
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.daysUntil}>
                {getDaysUntil(consultation.scheduleDate)}
              </Text>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>Ver</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {consultations.length > 3 && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onPress}>
            <Text style={styles.viewAllText}>
              Ver todas as {consultations.length} consultas
            </Text>
            <Icon.FontAwesome6 name="chevron-right" size={12} color="#2196F3" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginVertical: 8,
    shadowColor: "#22313F",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#22313F",
    marginLeft: 12,
    flex: 1,
  },
  addIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
    textAlign: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  consultationsList: {
    gap: 16,
  },
  consultationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  consultationInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#22313F",
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateTime: {
    fontSize: 12,
    color: "#666",
  },
  statusContainer: {
    alignItems: "flex-end",
    gap: 8,
  },
  daysUntil: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2196F3",
  },
  viewButton: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2196F3",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2196F3",
  },
});

export default UpcomingConsultationsCard;
