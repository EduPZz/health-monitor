import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icons';

const WeightSummaryCard = ({ weightData, onPress }) => {
  if (!weightData || weightData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon.FontAwesome6 name="weight-scale" size={24} color="#4CAF50" />
          <Text style={styles.title}>Peso Atual</Text>
        </View>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma pesagem registrada</Text>
          <Text style={styles.emptySubtext}>Comece a acompanhar seu peso</Text>
          
          <TouchableOpacity style={styles.addButton} onPress={onPress}>
            <Icon.FontAwesome6 name="plus" size={16} color="#FFF" />
            <Text style={styles.addButtonText}>Nova Pesagem</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const latestWeight = weightData[0];
  const previousWeight = weightData[1];

  const getWeightChange = () => {
    if (!latestWeight?.weight || !previousWeight?.weight) return null;
    
    const diff = latestWeight.weight - previousWeight.weight;
    const percentage = (diff / previousWeight.weight) * 100;
    
    if (Math.abs(percentage) < 1) return null;
    
    return {
      direction: diff > 0 ? 'up' : 'down',
      value: `${Math.abs(percentage).toFixed(1)}%`,
      absolute: Math.abs(diff).toFixed(1)
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const weightChange = getWeightChange();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon.FontAwesome6 name="weight-scale" size={24} color="#FFF" />
        </View>
        <Text style={styles.title}>Peso Atual</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.weightValue}>
          {latestWeight.weight ? `${latestWeight.weight} kg` : "N/A"}
        </Text>
        <Text style={styles.subtitle}>
          Última medição: {formatDate(latestWeight.date)}
        </Text>
        
        {weightChange && (
          <View style={styles.changeContainer}>
            <Icon.FontAwesome6 
              name={weightChange.direction === 'up' ? 'arrow-up' : 'arrow-down'} 
              size={12} 
              color={weightChange.direction === 'up' ? '#F44336' : '#4CAF50'} 
            />
            <Text style={[
              styles.changeText, 
              { color: weightChange.direction === 'up' ? '#F44336' : '#4CAF50' }
            ]}>
              {weightChange.direction === 'up' ? '+' : '-'}{weightChange.absolute} kg ({weightChange.value})
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22313F',
    flex: 1,
  },
  content: {
    alignItems: 'center',
  },
  weightValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22313F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default WeightSummaryCard;

