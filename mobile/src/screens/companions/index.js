import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import Icons from "../../components/Icons";
import useSocket from "../../hooks/useSocket";

const CompanionsScreen = () => {
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchCompanions = async () => {
    try {
      const response = await api.get("/user-companions/accompanied-by");
      setCompanions(response.data);
    } catch (error) {
      console.error("Error fetching companions:", error);
      Alert.alert("Erro", "Não foi possível carregar os acompanhados");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompanions();
  };

  // Handle real-time updates from companions
  const handleCompanionUpdate = (data) => {
    console.log("Companion update received:", data);
    // Refresh the list when we receive updates
    fetchCompanions();
  };

  // Initialize socket connection
  useSocket({
    onCompanionRequest: () => {
      // Handle new companion requests if needed
    },
    onCompanionUpdate: handleCompanionUpdate,
  });

  const renderCompanionItem = ({ item }) => {
    const companion = item.accompanying;
    const initials = companion.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <TouchableOpacity
        style={styles.companionCard}
        onPress={() => {
          // Navigate to companion details or measurements
          navigation.navigate("CompanionDetails", { companion });
        }}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.companionInfo}>
          <Text style={styles.companionName}>{companion.name}</Text>
          <Text style={styles.companionEmail}>{companion.email}</Text>
          <Text style={styles.companionAge}>
            {new Date().getFullYear() -
              new Date(companion.birthDate).getFullYear()}{" "}
            anos
          </Text>
        </View>
        <Icons.Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando acompanhados...</Text>
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
        <Text style={styles.headerTitle}>Meus Acompanhados</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={companions}
        renderItem={renderCompanionItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icons.Ionicons name="people-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>Nenhum acompanhado</Text>
            <Text style={styles.emptySubtitle}>
              Você ainda não está acompanhando ninguém
            </Text>
          </View>
        }
      />
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    padding: 20,
  },
  companionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1976D2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  companionInfo: {
    flex: 1,
  },
  companionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  companionEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  companionAge: {
    fontSize: 12,
    color: "#999",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});

export default CompanionsScreen;
