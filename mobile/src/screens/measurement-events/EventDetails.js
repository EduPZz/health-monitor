import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
} from "react-native";
import Layout from "../../components/layout";
import styles from "./eventDetailsStyles";
import api from "../../api";
import Icons from "../../components/Icons";

const MeasurementCard = ({ measurement }) => {
  const date = new Date(measurement.bioimpedanceMeasurement?.createdAt || new Date());
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  const bioimpedance = measurement.bioimpedanceMeasurement;

  return (
    <View style={styles.measurementCard}>
      <View style={styles.measurementHeader}>
        <View style={styles.measurementTypeContainer}>
          <Icons.MaterialIcons
            name={measurement.measurementType === "scale" ? "weight-scale" : "edit"}
            size={24}
            color="#176B87"
          />
          <Text style={styles.measurementType}>
            {measurement.measurementType === "scale" ? "Balança" : "Manual"}
          </Text>
        </View>
        <Text style={styles.measurementDate}>{formattedDate}</Text>
      </View>

      {bioimpedance && (
        <View style={styles.measurementMetrics}>
          {bioimpedance.weight && (
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Peso:</Text>
              <Text style={styles.metricValue}>{bioimpedance.weight} kg</Text>
            </View>
          )}
          {bioimpedance.bodyFatPercentage && (
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Gordura Corporal:</Text>
              <Text style={styles.metricValue}>{bioimpedance.bodyFatPercentage}%</Text>
            </View>
          )}
          {bioimpedance.muscleMass && (
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Massa Muscular:</Text>
              <Text style={styles.metricValue}>{bioimpedance.muscleMass} kg</Text>
            </View>
          )}
          {bioimpedance.waterPercentage && (
            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Água:</Text>
              <Text style={styles.metricValue}>{bioimpedance.waterPercentage}%</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const EventDetails = ({ navigation, route }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fabScale] = useState(new Animated.Value(1));

  const fetchEventDetails = async () => {
    try {
      setIsLoading(true);
      const { data: eventData } = await api.get(`measurement-events/${eventId}`);
      setEvent(eventData);
      setMeasurements(eventData.measurementSession || []);
    } catch (error) {
      console.error("Failed to fetch event details", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes do evento.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEventDetails();
    });

    return unsubscribe;
  }, [navigation]);

  const animateFabPress = () => {
    Animated.sequence([
      Animated.timing(fabScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fabScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const navigateToMeasurementSelection = () => {
    animateFabPress();
    setTimeout(() => {
      navigation.navigate("MeasurementSelection", { eventId });
    }, 100);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEventDetails();
  };

  const renderMeasurement = ({ item }) => (
    <MeasurementCard measurement={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icons.MaterialIcons name="straighten" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>Nenhuma medição ainda</Text>
      <Text style={styles.emptyStateSubtitle}>
        Toque no botão + para adicionar sua primeira medição a este evento
      </Text>
    </View>
  );

  const goBack = () => navigation.goBack();

  if (isLoading) {
    return (
      <Layout title="Detalhes do Evento" goBackFunction={goBack}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#176B87" />
        </View>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout title="Detalhes do Evento" goBackFunction={goBack}>
        <View style={styles.loadingContainer}>
          <Text>Evento não encontrado</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout title={event.name} goBackFunction={goBack}>
      <View style={styles.container}>
        {/* Event Info Section */}
        <View style={styles.eventInfoCard}>
          <View style={styles.eventHeader}>
            <Icons.MaterialIcons name="event" size={28} color="#176B87" />
            <Text style={styles.eventName}>{event.name}</Text>
          </View>
          {event.description && (
            <Text style={styles.eventDescription}>{event.description}</Text>
          )}
          <View style={styles.eventStats}>
            <View style={styles.statItem}>
              <Icons.MaterialIcons name="straighten" size={20} color="#666" />
              <Text style={styles.statText}>
                {measurements.length} {measurements.length === 1 ? "medição" : "medições"}
              </Text>
            </View>
          </View>
        </View>

        {/* Measurements List */}
        {measurements.length > 0 ? (
          <FlatList
            data={measurements}
            renderItem={renderMeasurement}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          renderEmptyState()
        )}

        {/* Floating Action Button */}
        <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
          <TouchableOpacity
            style={styles.fabTouchable}
            onPress={navigateToMeasurementSelection}
            activeOpacity={0.8}
          >
            <Icons.MaterialIcons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Layout>
  );
};

export default EventDetails;

