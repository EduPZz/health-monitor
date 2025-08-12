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

const DateCard = ({ date, userTimezone }) => {
  const dateInTimeZone = new Date(date);

  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: userTimezone || "UTC",
  }).format(dateInTimeZone);

  const formattedTime = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: userTimezone || "UTC",
  }).format(dateInTimeZone);

  return (
    <View style={styles.dateCard}>
      <Text style={styles.dateCardText}>{formattedDate}</Text>
      <Text style={styles.timeText}>{formattedTime}</Text>
    </View>
  );
};

const ConsultationCard = ({ consultation, userTimezone, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      "Excluir consulta",
      "Tem certeza que deseja excluir esta consulta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => onDelete(consultation.id) }
      ]
    );
  };

  const isUpcoming = new Date(consultation.scheduleDate) > new Date();
  const statusColor = isUpcoming ? "#4CAF50" : "#FF9800";
  const statusText = isUpcoming ? "Próxima" : "Realizada";

  return (
    <View style={styles.consultationCard}>
      <View style={styles.consultationHeader}>
        <View style={styles.doctorInfo}>
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
          <Icons.MaterialIcons
            name="person"
            size={24}
            color="#176B87"
            style={styles.doctorIcon}
          />
          <View style={styles.doctorDetails}>
            <Text style={styles.doctorName}>{consultation.doctorName}</Text>
            <Text style={styles.specialization}>{consultation.specialization}</Text>
            <View style={styles.statusContainer}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
          </View>
        </View>
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
      
      <View style={styles.consultationFooter}>
        <DateCard
          date={consultation.scheduleDate}
          userTimezone={userTimezone}
        />
      </View>
    </View>
  );
};

const Consultations = ({ navigation }) => {
  const [userTimezone, setUserTimezone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [consultations, setConsultations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fabScale] = useState(new Animated.Value(1));

  const goBack = () => navigation.goBack();

  const fetchConsultations = async () => {
    try {
      const response = await api.get("consultation");
      // Sort consultations by scheduleDate in descending order (most recent first)
      const sortedConsultations = response.data.sort((a, b) => 
        new Date(b.scheduleDate) - new Date(a.scheduleDate)
      );
      setConsultations(sortedConsultations);
    } catch (error) {
      console.error("Failed to fetch consultations", error);
      Alert.alert("Não foi possível carregar as consultas.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchUserTimezone = async () => {
      try {
        const {
          data: { timezone },
        } = await api.get("auth/profile");
        setUserTimezone(timezone);
      } catch (error) {
        console.error("Failed to fetch timezone", error);
      }
    };

    fetchUserTimezone();
    fetchConsultations();
  }, []);

  // Add focus listener to refresh data when returning from AddConsultation
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchConsultations();
    });

    return unsubscribe;
  }, [navigation]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`consultation/${id}`);
      setConsultations(
        consultations.filter((consultation) => consultation.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete consultation", error);
      Alert.alert("Não foi possível deletar a consulta.");
    }
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

  const navigateToAddConsultation = () => {
    animateFabPress();
    setTimeout(() => {
      navigation.navigate("AddConsultation");
    }, 100);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConsultations();
  };

  const renderConsultation = ({ item }) => (
    <ConsultationCard
      consultation={item}
      userTimezone={userTimezone}
      onDelete={handleDelete}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icons.MaterialIcons
        name="event-busy"
        size={64}
        color="#ccc"
      />
      <Text style={styles.emptyStateTitle}>Nenhuma consulta agendada</Text>
      <Text style={styles.emptyStateSubtitle}>
        Toque no botão + para agendar sua primeira consulta
      </Text>
    </View>
  );

  return (
    <Layout title="Consultas médicas" goBackFunction={goBack}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#176B87" />
        </View>
      ) : (
        <View style={styles.container}>
          {consultations.length > 0 ? (
            <FlatList
              data={consultations}
              renderItem={renderConsultation}
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
              onPress={navigateToAddConsultation}
              activeOpacity={0.8}
            >
              <Icons.MaterialIcons
                name="add"
                size={28}
                color="#fff"
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </Layout>
  );
};

export default Consultations;
