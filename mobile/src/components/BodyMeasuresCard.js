import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icons';

const BodyMeasuresCard = ({ measures, onPress, onAddNew }) => {
  if (!measures || measures.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon.MaterialCommunityIcons name="tape-measure" size={24} color="#FF9800" />
          <Text style={styles.title}>Medidas Corporais</Text>
        </View>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma medida registrada</Text>
          <Text style={styles.emptySubtext}>Comece a acompanhar suas medidas</Text>
          
          <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
            <Icon.FontAwesome6 name="plus" size={16} color="#FFF" />
            <Text style={styles.addButtonText}>Registrar Medidas</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const latestMeasure = measures[0];
  const previousMeasure = measures[1];

  const getMeasureChange = (current, previous) => {
    if (!current || !previous) return null;
    const diff = current - previous;
    const percentage = (diff / previous) * 100;
    
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

  const chestChange = getMeasureChange(
    latestMeasure.chestCircumference,
    previousMeasure?.chestCircumference
  );
  
  const waistChange = getMeasureChange(
    latestMeasure.waistCircumference,
    previousMeasure?.waistCircumference
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon.MaterialCommunityIcons name="tape-measure" size={24} color="#FF9800" />
        <Text style={styles.title}>Medidas Corporais</Text>
        <TouchableOpacity style={styles.addIconButton} onPress={onAddNew}>
          <Icon.FontAwesome6 name="plus" size={16} color="#FF9800" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.measuresGrid}>
        <View style={styles.measureItem}>
          <Text style={styles.measureLabel}>Tórax</Text>
          <Text style={styles.measureValue}>
            {latestMeasure.chestCircumference || 'N/A'} cm
          </Text>
          {chestChange && (
            <View style={styles.changeContainer}>
              <Icon.FontAwesome6 
                name={chestChange.direction === 'up' ? 'arrow-up' : 'arrow-down'} 
                size={10} 
                color={chestChange.direction === 'up' ? '#F44336' : '#4CAF50'} 
              />
              <Text style={[
                styles.changeText, 
                { color: chestChange.direction === 'up' ? '#F44336' : '#4CAF50' }
              ]}>
                {chestChange.value}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.measureItem}>
          <Text style={styles.measureLabel}>Cintura</Text>
          <Text style={styles.measureValue}>
            {latestMeasure.waistCircumference || 'N/A'} cm
          </Text>
          {waistChange && (
            <View style={styles.changeContainer}>
              <Icon.FontAwesome6 
                name={waistChange.direction === 'up' ? 'arrow-up' : 'arrow-down'} 
                size={10} 
                color={waistChange.direction === 'up' ? '#F44336' : '#4CAF50'} 
              />
              <Text style={[
                styles.changeText, 
                { color: waistChange.direction === 'up' ? '#F44336' : '#4CAF50' }
              ]}>
                {waistChange.value}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.measureItem}>
          <Text style={styles.measureLabel}>Braço</Text>
          <Text style={styles.measureValue}>
            {latestMeasure.armCircumference || 'N/A'} cm
          </Text>
        </View>
        
        <View style={styles.measureItem}>
          <Text style={styles.measureLabel}>Coxa</Text>
          <Text style={styles.measureValue}>
            {latestMeasure.thighCircumference || 'N/A'} cm
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.lastUpdate}>
          Última atualização: {formatDate(latestMeasure.date)}
        </Text>
        
        <TouchableOpacity style={styles.viewAllButton} onPress={onPress}>
          <Text style={styles.viewAllText}>Ver histórico completo</Text>
          <Icon.FontAwesome6 name="chevron-right" size={12} color="#FF9800" />
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22313F',
    marginLeft: 12,
    flex: 1,
  },
  addIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#FF9800',
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
  measuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  measureItem: {
    width: '48%',
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  measureLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  measureValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22313F',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#666',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF9800',
  },
});

export default BodyMeasuresCard;
