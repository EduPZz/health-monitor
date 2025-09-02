import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icons';

const RecentExercisesCard = ({ exercises, onPress, onAddNew }) => {
  if (!exercises || exercises.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon.FontAwesome6 name="dumbbell" size={24} color="#9C27B0" />
          <Text style={styles.title}>Exercícios Recentes</Text>
        </View>
        
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhum exercício registrado</Text>
          <Text style={styles.emptySubtext}>Comece a registrar seus treinos</Text>
          
          <TouchableOpacity style={styles.addButton} onPress={onAddNew}>
            <Icon.FontAwesome6 name="plus" size={16} color="#FFF" />
            <Text style={styles.addButtonText}>Registrar Exercício</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Hoje';
    if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const getExerciseIcon = (exerciseType) => {
    switch (exerciseType?.toLowerCase()) {
      case 'cardio':
        return 'heart-pulse';
      case 'strength':
        return 'dumbbell';
      case 'flexibility':
        return 'person-walking';
      case 'yoga':
        return 'person-praying';
      default:
        return 'dumbbell';
    }
  };

  const getExerciseColor = (exerciseType) => {
    switch (exerciseType?.toLowerCase()) {
      case 'cardio':
        return '#F44336';
      case 'strength':
        return '#9C27B0';
      case 'flexibility':
        return '#4CAF50';
      case 'yoga':
        return '#FF9800';
      default:
        return '#9C27B0';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon.FontAwesome6 name="dumbbell" size={24} color="#9C27B0" />
        <Text style={styles.title}>Exercícios Recentes</Text>
        <TouchableOpacity style={styles.addIconButton} onPress={onAddNew}>
          <Icon.FontAwesome6 name="plus" size={16} color="#9C27B0" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.exercisesList}>
        {exercises.slice(0, 3).map((exercise, index) => (
          <View key={exercise.id || index} style={styles.exerciseItem}>
            <View style={styles.exerciseIcon}>
              <Icon.FontAwesome6 
                name={getExerciseIcon(exercise.exerciseType)} 
                size={16} 
                color={getExerciseColor(exercise.exerciseType)} 
              />
            </View>
            
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>
                {exercise.exerciseName || 'Exercício não informado'}
              </Text>
              <Text style={styles.exerciseType}>
                {exercise.exerciseType || 'Tipo não informado'}
              </Text>
              <View style={styles.dateContainer}>
                <Icon.FontAwesome6 name="calendar" size={10} color="#666" />
                <Text style={styles.dateText}>
                  {formatDate(exercise.date)}
                </Text>
              </View>
            </View>
            
            <View style={styles.exerciseStats}>
              {exercise.duration && (
                <Text style={styles.statText}>{exercise.duration} min</Text>
              )}
              {exercise.sets && exercise.reps && (
                <Text style={styles.statText}>{exercise.sets}x{exercise.reps}</Text>
              )}
            </View>
          </View>
        ))}
        
        {exercises.length > 3 && (
          <TouchableOpacity style={styles.viewAllButton} onPress={onPress}>
            <Text style={styles.viewAllText}>
              Ver todos os {exercises.length} exercícios
            </Text>
            <Icon.FontAwesome6 name="chevron-right" size={12} color="#9C27B0" />
          </TouchableOpacity>
        )}
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
    backgroundColor: '#F3E5F5',
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
    backgroundColor: '#9C27B0',
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
  exercisesList: {
    gap: 16,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  exerciseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22313F',
    marginBottom: 4,
  },
  exerciseType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  exerciseStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9C27B0',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9C27B0',
  },
});

export default RecentExercisesCard;
