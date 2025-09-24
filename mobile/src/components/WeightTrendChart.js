import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const WeightTrendChart = ({ weightData }) => {
  if (!weightData || weightData.length < 2) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Dados insuficientes para mostrar tendência</Text>
        <Text style={styles.noDataSubtext}>Adicione mais medições de peso para ver o gráfico</Text>
      </View>
    );
  }

  // Get last 7 weight measurements, sorted by date
  const recentWeights = weightData
    .filter(measure => measure.weight)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-7);

  const chartData = {
    labels: recentWeights.map(measure => {
      const date = new Date(measure.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }),
    datasets: [
      {
        data: recentWeights.map(measure => measure.weight),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(34, 49, 63, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(34, 49, 63, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4CAF50',
    },
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tendência do Peso</Text>
        <Text style={styles.subtitle}>Últimas 7 medições</Text>
      </View>
      
      <LineChart
        data={chartData}
        width={screenWidth - 48} // Account for margins
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withShadow={false}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={false}
      />
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Peso Atual</Text>
          <Text style={styles.statValue}>
            {recentWeights[recentWeights.length - 1]?.weight} kg
          </Text>
        </View>
        
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Variação</Text>
          <Text style={[
            styles.statValue,
            { color: recentWeights[recentWeights.length - 1]?.weight > recentWeights[0]?.weight ? '#F44336' : '#4CAF50' }
          ]}>
            {recentWeights[recentWeights.length - 1]?.weight > recentWeights[0]?.weight ? '+' : ''}
            {(recentWeights[recentWeights.length - 1]?.weight - recentWeights[0]?.weight).toFixed(1)} kg
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginVertical: 8,
    shadowColor: '#22313F',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22313F',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22313F',
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noDataText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default WeightTrendChart;
