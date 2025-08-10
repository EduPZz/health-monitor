import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icons from "../../components/Icons";
import useSocket from "../../hooks/useSocket";
import { useCompanionData } from "./hooks/useCompanionData";
import { useExerciseFilter } from "./hooks/useExerciseFilter";
import CompanionHeader from "./components/CompanionHeader";
import DateFilter from "./components/DateFilter";
import AverageCard from "./components/AverageCard";
import ExerciseChart from "./components/ExerciseChart";
import ExerciseItem from "./components/ExerciseItem";
import MeasurementItem from "./components/MeasurementItem";
import EmptyState from "./components/EmptyState";

const CompanionDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { companion: routeCompanion } = route.params;
  const [activeTab, setActiveTab] = React.useState("exercises");

  const {
    companion,
    setCompanion,
    measurements,
    exercises,
    loading,
    refreshing,
    onRefresh,
    fetchCompanionData,
  } = useCompanionData(routeCompanion.id);

  const {
    selectedDateRange,
    setSelectedDateRange,
    filteredExercises,
    chartData,
    chartDataFormatted,
    typesChartFormatted,
    averageHours,
    averageMinutes,
  } = useExerciseFilter(exercises);

  const handleCompanionUpdate = (data) => {
    if (data.userId === routeCompanion.id) {
      fetchCompanionData();
    }
  };

  useSocket({
    onCompanionRequest: () => {},
    onCompanionUpdate: handleCompanionUpdate,
  });

  React.useEffect(() => {
    setCompanion(routeCompanion);
  }, [routeCompanion]);

  const renderExercisesTab = () => (
    <View style={styles.tabContent}>
      <DateFilter
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
      />

      <AverageCard
        averageHours={averageHours}
        averageMinutes={averageMinutes}
        selectedDateRange={selectedDateRange}
      />

      {chartData.data.length > 0 && (
        <ExerciseChart
          data={chartDataFormatted}
          title="Evolução de Exercícios"
          color="#4CAF50"
        />
      )}

      {chartData.exerciseTypes.length > 0 && (
        <ExerciseChart
          data={typesChartFormatted}
          title="Tipos de Exercício"
          color="#1976D2"
        />
      )}

      {filteredExercises.length > 0 ? (
        filteredExercises?.map((exercise, index) => (
          <ExerciseItem key={exercise.id || index} exercise={exercise} />
        ))
      ) : (
        <EmptyState
          icon={<Icons.FontAwesome6 name="dumbbell" size={64} color="#ccc" />}
          title="Nenhum exercício registrado"
          subtitle="O acompanhado ainda não registrou exercícios"
        />
      )}
    </View>
  );

  const renderMeasurementsTab = () => (
    <View style={styles.tabContent}>
      {measurements.length > 0 ? (
        <>
          {/* Highlight the last measurement */}
          <View style={styles.lastMeasurementHighlight}>
            <Text style={styles.highlightTitle}>Última Medida</Text>
            <MeasurementItem
              measurement={measurements[0]}
              isHighlighted={true}
            />
          </View>
          
          {/* Show all measurements */}
          <Text style={styles.sectionTitle}>Todas as Medidas</Text>
          {measurements?.map((measurement, index) => (
            <MeasurementItem
              key={measurement.id || index}
              measurement={measurement}
              isHighlighted={false}
            />
          ))}
        </>
      ) : (
        <EmptyState
          icon={<Icons.Ionicons name="body-outline" size={64} color="#ccc" />}
          title="Nenhuma medida registrada"
          subtitle="O acompanhado ainda não registrou medidas corporais"
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icons.Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Acompanhado</Text>
        <View style={styles.placeholder} />
      </View>

      {companion && <CompanionHeader companion={companion} />}

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "exercises" && styles.activeTab]}
          onPress={() => setActiveTab("exercises")}
        >
          <Icons.FontAwesome6 
            name="dumbbell" 
            size={20} 
            color={activeTab === "exercises" ? "#4CAF50" : "#666"} 
          />
          <Text style={[styles.tabText, activeTab === "exercises" && styles.activeTabText]}>
            Exercícios
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "measurements" && styles.activeTab]}
          onPress={() => setActiveTab("measurements")}
        >
          <Icons.Ionicons 
            name="body-outline" 
            size={20} 
            color={activeTab === "measurements" ? "#4CAF50" : "#666"} 
          />
          <Text style={[styles.tabText, activeTab === "measurements" && styles.activeTabText]}>
            Medidas
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === "exercises" ? renderExercisesTab() : renderMeasurementsTab()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  activeTab: {
    backgroundColor: "#e8f5e8",
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#4CAF50",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
    marginTop: 20,
  },
  lastMeasurementHighlight: {
    backgroundColor: "#e8f5e8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 12,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});

export default CompanionDetails;
