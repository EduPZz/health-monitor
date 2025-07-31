import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';
import Icons from '../../components/Icons';
import useSocket from '../../hooks/useSocket';

const CompanionDetails = () => {
  const [companion, setCompanion] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { companion: routeCompanion } = route.params;

  const fetchCompanionData = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await api.get(`/body-measures/user/${routeCompanion.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMeasurements(response.data);
      setCompanion(routeCompanion);
    } catch (error) {
      console.error('Error fetching companion data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do acompanhado');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompanionData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompanionData();
  };

  // Handle real-time updates from the companion
  const handleCompanionUpdate = (data) => {
    console.log('Companion update received:', data);
    if (data.userId === routeCompanion.id) {
      // Refresh data when companion updates their measurements
      fetchCompanionData();
    }
  };

  // Initialize socket connection
  useSocket({
    onCompanionRequest: () => {
      // Handle companion requests if needed
    },
    onCompanionUpdate: handleCompanionUpdate,
  });

  const renderMeasurementItem = ({ item }) => (
    <View style={styles.measurementCard}>
      <View style={styles.measurementHeader}>
        <Text style={styles.measurementDate}>
          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
        </Text>
        <Text style={styles.measurementTime}>
          {new Date(item.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      
      <View style={styles.measurementData}>
        {item.weight && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="weight-scale" size={16} color="#1976D2" />
            <Text style={styles.measurementLabel}>Peso:</Text>
            <Text style={styles.measurementValue}>{item.weight} kg</Text>
          </View>
        )}
        
        {item.height && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="ruler" size={16} color="#1976D2" />
            <Text style={styles.measurementLabel}>Altura:</Text>
            <Text style={styles.measurementValue}>{item.height} cm</Text>
          </View>
        )}
        
        {item.chestCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color="#1976D2" />
            <Text style={styles.measurementLabel}>Circunferência do Tórax:</Text>
            <Text style={styles.measurementValue}>{item.chestCircumference} cm</Text>
          </View>
        )}
        
        {item.waistCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color="#1976D2" />
            <Text style={styles.measurementLabel}>Circunferência da Cintura:</Text>
            <Text style={styles.measurementValue}>{item.waistCircumference} cm</Text>
          </View>
        )}
        
        {item.hipCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color="#1976D2" />
            <Text style={styles.measurementLabel}>Circunferência do Quadril:</Text>
            <Text style={styles.measurementValue}>{item.hipCircumference} cm</Text>
          </View>
        )}
        
        {item.leftArmCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color="#1976D2" />
            <Text style={styles.measurementLabel}>Circunferência do Braço Esquerdo:</Text>
            <Text style={styles.measurementValue}>{item.leftArmCircumference} cm</Text>
          </View>
        )}
        
        {item.rightArmCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color="#1976D2" />
            <Text style={styles.measurementLabel}>Circunferência do Braço Direito:</Text>
            <Text style={styles.measurementValue}>{item.rightArmCircumference} cm</Text>
          </View>
        )}
        
        {item.leftThighCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color="#1976D2" />
            <Text style={styles.measurementLabel}>Circunferência da Coxa Esquerda:</Text>
            <Text style={styles.measurementValue}>{item.leftThighCircumference} cm</Text>
          </View>
        )}
        
        {item.rightThighCircumference && (
          <View style={styles.measurementItem}>
            <Icons.FontAwesome6 name="circle" size={16} color="#1976D2" />
            <Text style={styles.measurementLabel}>Circunferência da Coxa Direita:</Text>
            <Text style={styles.measurementValue}>{item.rightThighCircumference} cm</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  const initials = companion?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {companion && (
          <View style={styles.companionInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.companionName}>{companion.name}</Text>
            <Text style={styles.companionEmail}>{companion.email}</Text>
            <Text style={styles.companionAge}>
              {new Date().getFullYear() - new Date(companion.birthDate).getFullYear()} anos
            </Text>
          </View>
        )}

        <View style={styles.measurementsSection}>
          <Text style={styles.sectionTitle}>Medidas Corporais</Text>
          {measurements.length > 0 ? (
            measurements.map((measurement, index) => (
              <View key={measurement.id || index}>
                {renderMeasurementItem({ item: measurement })}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icons.Ionicons name="body-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>Nenhuma medida registrada</Text>
              <Text style={styles.emptySubtitle}>
                O acompanhado ainda não registrou medidas corporais
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  companionInfo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  companionName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  companionEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  companionAge: {
    fontSize: 14,
    color: '#999',
  },
  measurementsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  measurementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  measurementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  measurementDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  measurementTime: {
    fontSize: 12,
    color: '#666',
  },
  measurementData: {
    gap: 8,
  },
  measurementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  measurementLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  measurementValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default CompanionDetails; 