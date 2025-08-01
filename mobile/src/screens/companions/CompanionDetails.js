import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, BarChart } from 'react-native-chart-kit';
import api from '../../api';
import Icons from '../../components/Icons';
import useSocket from '../../hooks/useSocket';

const screenWidth = Dimensions.get('window').width;

const CompanionDetails = () => {
  const [companion, setCompanion] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('week'); // week, month, year
  const [filteredExercises, setFilteredExercises] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { companion: routeCompanion } = route.params;

  const fetchCompanionData = async () => {
    try {
      const [measurementsResponse, exercisesResponse] = await Promise.all([
        api.get(`/body-measure/user/${routeCompanion.id}`),
        api.get(`/exercise/user/${routeCompanion.id}`)
      ]);
      
      setMeasurements(measurementsResponse.data);
      setExercises(exercisesResponse.data);
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

  // Filter exercises based on selected date range
  useEffect(() => {
    const filterExercises = () => {
      const now = new Date();
      let startDate;

      switch (selectedDateRange) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      const filtered = exercises.filter(exercise => 
        new Date(exercise.beginTime) >= startDate
      );
      setFilteredExercises(filtered);
    };

    filterExercises();
  }, [exercises, selectedDateRange]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCompanionData();
  };

  // Handle real-time updates from the companion
  const handleCompanionUpdate = (data) => {
    console.log('Companion update received:', data);
    if (data.userId === routeCompanion.id) {
      // Refresh data when companion updates their measurements or exercises
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

  // Transform exercises data for charts
  const transformExercisesForChart = () => {
    const dailyData = {};
    const exerciseTypes = {};

    filteredExercises.forEach((exercise) => {
      const date = new Date(exercise.beginTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      
      const duration = (new Date(exercise.endTime) - new Date(exercise.beginTime)) / (1000 * 60); // duration in minutes
      
      if (!dailyData[date]) {
        dailyData[date] = { date, total: 0 };
      }
      
      if (!exerciseTypes[exercise.type]) {
        exerciseTypes[exercise.type] = 0;
      }
      
      dailyData[date].total += duration;
      exerciseTypes[exercise.type] += duration;
    });

    // Sort daily data by date
    const sortedDailyData = Object.values(dailyData).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

    return {
      dailyData: sortedDailyData.map(day => ({
        date: day.date,
        total: Math.round(day.total),
        data: [Math.round(day.total)]
      })),
      exerciseTypes: Object.entries(exerciseTypes)
        .sort(([,a], [,b]) => b - a) // Sort by duration descending
        .map(([type, duration]) => ({
          type,
          duration: Math.round(duration),
          data: [Math.round(duration)]
        }))
    };
  };

  const chartData = transformExercisesForChart();

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

  const renderExerciseItem = ({ item }) => (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseDate}>
          {new Date(item.beginTime).toLocaleDateString('pt-BR')}
        </Text>
        <Text style={styles.exerciseTime}>
          {new Date(item.beginTime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })} - {new Date(item.endTime).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      
      <View style={styles.exerciseData}>
        <View style={styles.exerciseItem}>
          <Icons.FontAwesome6 name="dumbbell" size={16} color="#4CAF50" />
          <Text style={styles.exerciseLabel}>Tipo:</Text>
          <Text style={styles.exerciseValue}>{item.type}</Text>
        </View>
        
        <View style={styles.exerciseItem}>
          <Icons.FontAwesome6 name="clock" size={16} color="#4CAF50" />
          <Text style={styles.exerciseLabel}>Duração:</Text>
          <Text style={styles.exerciseValue}>
            {Math.round((new Date(item.endTime) - new Date(item.beginTime)) / (1000 * 60))} min
          </Text>
        </View>
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

  // Calculate average daily exercise time
  const averageDailyTime = chartData.dailyData.length > 0 
    ? Math.round(chartData.dailyData.reduce((sum, day) => sum + day.total, 0) / chartData.dailyData.length)
    : 0;

  const averageHours = Math.floor(averageDailyTime / 60);
  const averageMinutes = averageDailyTime % 60;

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

        {/* Exercises Section */}
        <View style={styles.exercisesSection}>
          <Text style={styles.sectionTitle}>Exercícios</Text>
          
          {/* Date Filter */}
          <View style={styles.dateFilterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, selectedDateRange === 'week' && styles.filterButtonActive]}
              onPress={() => setSelectedDateRange('week')}
            >
              <Text style={[styles.filterButtonText, selectedDateRange === 'week' && styles.filterButtonTextActive]}>
                Semana
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedDateRange === 'month' && styles.filterButtonActive]}
              onPress={() => setSelectedDateRange('month')}
            >
              <Text style={[styles.filterButtonText, selectedDateRange === 'month' && styles.filterButtonTextActive]}>
                Mês
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedDateRange === 'year' && styles.filterButtonActive]}
              onPress={() => setSelectedDateRange('year')}
            >
              <Text style={[styles.filterButtonText, selectedDateRange === 'year' && styles.filterButtonTextActive]}>
                Ano
              </Text>
            </TouchableOpacity>
          </View>

          {/* Average Daily Time Card */}
          <View style={styles.averageCard}>
            <Text style={styles.averageTitle}>Média Diária</Text>
            <Text style={styles.averageTime}>
              {averageHours}h {averageMinutes}m
            </Text>
            <Text style={styles.averageSubtitle}>
              {selectedDateRange === 'week' ? 'esta semana' : 
               selectedDateRange === 'month' ? 'este mês' : 'este ano'}
            </Text>
          </View>

          {/* Exercise Chart */}
          {chartData.dailyData.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Evolução de Exercícios</Text>
              <View style={styles.chartWrapper}>
                <BarChart
                  data={chartData.dailyData}
                  width={screenWidth - 60}
                  height={200}
                  yAxisLabel=""
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    barPercentage: 0.6,
                    propsForLabels: {
                      fontSize: 10,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  fromZero
                  showBarTops
                  showValuesOnTopOfBars
                  withInnerLines={false}
                  withOuterLines={false}
                  withVerticalLabels={true}
                  withHorizontalLabels={true}
                  withDots={false}
                  withShadow={false}
                  withScrollableDot={false}
                  withCustomBarColorFromDataset={false}
                  flatColor={true}
                  segments={4}
                  getBarColor={(data, index) => '#4CAF50'}
                />
              </View>
            </View>
          )}

          {/* Exercise Types Chart */}
          {chartData.exerciseTypes.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Tipos de Exercício</Text>
              <View style={styles.chartWrapper}>
                <BarChart
                  data={chartData.exerciseTypes}
                  width={screenWidth - 60}
                  height={180}
                  yAxisLabel=""
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(25, 118, 210, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    barPercentage: 0.6,
                    propsForLabels: {
                      fontSize: 10,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  fromZero
                  showBarTops
                  showValuesOnTopOfBars
                  withInnerLines={false}
                  withOuterLines={false}
                  withVerticalLabels={true}
                  withHorizontalLabels={true}
                  withDots={false}
                  withShadow={false}
                  withScrollableDot={false}
                  withCustomBarColorFromDataset={false}
                  flatColor={true}
                  segments={4}
                  getBarColor={(data, index) => '#1976D2'}
                />
              </View>
            </View>
          )}

          {/* Exercise List */}
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise, index) => (
              <View key={exercise.id || index}>
                {renderExerciseItem({ item: exercise })}
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Icons.FontAwesome6 name="dumbbell" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>Nenhum exercício registrado</Text>
              <Text style={styles.emptySubtitle}>
                O acompanhado ainda não registrou exercícios
              </Text>
            </View>
          )}
        </View>

        {/* Body Measurements Section */}
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
  exercisesSection: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
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
  dateFilterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#1976D2',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  averageCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  averageTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  averageTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  averageSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
  },
  exerciseCard: {
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
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  exerciseDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  exerciseTime: {
    fontSize: 12,
    color: '#666',
  },
  exerciseData: {
    gap: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exerciseLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  exerciseValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
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