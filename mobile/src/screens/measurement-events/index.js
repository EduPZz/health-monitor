import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import Layout from "../../components/layout";
import styles from "./styles";
import api from "../../api";
import Icons from "../../components/Icons";

const DateCard = ({ date }) => {
  const dateInTimeZone = new Date(date);

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateInTimeZone);

  return (
    <View style={styles.dateCard}>
      <Text style={styles.dateCardText}>{formattedDate}</Text>
    </View>
  );
};

const EventCard = ({ event, onEdit, onDelete, onPress }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    Alert.alert(
      "Excluir evento",
      "Tem certeza que deseja excluir este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => onDelete(event.id) }
      ]
    );
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(event);
  };

  return (
    <TouchableOpacity style={styles.eventCard} onPress={() => onPress(event)} activeOpacity={0.7}>
      <View style={styles.eventHeader}>
        <View style={styles.eventInfo}>
          <Icons.MaterialIcons
            name="event"
            size={24}
            color="#176B87"
            style={styles.eventIcon}
          />
          <View style={styles.eventDetails}>
            <Text style={styles.eventName}>{event.name}</Text>
            {event.description && (
              <Text style={styles.eventDescription}>{event.description}</Text>
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.eventFooter}>
        <DateCard date={event.createdAt} />
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleEdit}
            style={styles.editButton}
          >
            <Icons.MaterialIcons
              name="edit"
              size={20}
              color="#176B87"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={styles.deleteButton}
          >
            <Icons.MaterialIcons
              name="delete-outline"
              size={20}
              color="#ff4d4d"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MeasurementEvent = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fabScale] = useState(new Animated.Value(1));

  const fetchEvents = async () => {
    try {
      const { data: events } = await api.get("measurement-events");
      // Sort events by createdAt in descending order (most recent first)
      const sortedEvents = events.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Failed to fetch events", error);
      Alert.alert("Erro", "Não foi possível carregar os eventos.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add focus listener to refresh data when returning from AddMeasurementEvent
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents();
    });

    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`measurement-events/${id}`);
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Failed to delete event", error);
      Alert.alert("Erro", "Não foi possível deletar o evento.");
    }
  };

  const handleEdit = (event) => {
    navigation.navigate("AddMeasurementEvent", {
      eventId: event.id,
      event: event,
    });
  };

  const handleEventPress = (event) => {
    navigation.navigate("EventDetails", {
      eventId: event.id,
    });
  };

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

  const navigateToAddEvent = () => {
    animateFabPress();
    setTimeout(() => {
      navigation.navigate("AddMeasurementEvent");
    }, 100);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const renderEvent = ({ item }) => (
    <EventCard
      event={item}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onPress={handleEventPress}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icons.MaterialIcons name="event-busy" size={64} color="#ccc" />
      <Text style={styles.emptyStateTitle}>Nenhum evento criado!</Text>
      <Text style={styles.emptyStateSubtitle}>
        Toque no botão + para criar seu primeiro evento de medição
      </Text>
    </View>
  );

  return (
    <Layout title="Eventos de Medição">
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#176B87" />
        </View>
      ) : (
        <View style={styles.container}>
          {events.length > 0 ? (
            <FlatList
              data={events}
              renderItem={renderEvent}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          ) : (
            renderEmptyState()
          )}

          {/* Floating Action Button */}
          <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
            <TouchableOpacity
              style={styles.fabTouchable}
              onPress={navigateToAddEvent}
              activeOpacity={0.8}
            >
              <Icons.MaterialIcons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </Layout>
  );
};

export default MeasurementEvent;
