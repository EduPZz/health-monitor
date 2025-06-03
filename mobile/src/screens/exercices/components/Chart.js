import React, { useEffect, useState } from 'react';
import { View, Dimensions, Text } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import api from '../../../api';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const ExercisesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [colors, setColors] = useState({});

  useEffect(() => {
    const getExercises = async () => {
      try {
        const { data: exercises } = await api.get('exercise');
        const groupedData = filterAndGroupExercises(exercises);
        const { data, colorMap } = prepareChartData(groupedData);
        setChartData(data);
        setColors(colorMap);
      } catch (error) {
        console.log(error);
      }
    };
    getExercises();
  }, []);

  const getWeekRange = () => {
    const startOfWeek = dayjs().startOf('isoWeek'); // Monday
    const endOfWeek = dayjs().endOf('isoWeek'); // Sunday
    return { startOfWeek, endOfWeek };
  };

  const filterAndGroupExercises = (exercises) => {
    const { startOfWeek, endOfWeek } = getWeekRange();

    return exercises
      .filter((exercise) => {
        const exerciseDate = dayjs(exercise.beginTime);
        return exerciseDate.isAfter(startOfWeek) && exerciseDate.isBefore(endOfWeek);
      })
      .reduce((acc, exercise) => {
        const type = exercise.type;
        const day = dayjs(exercise.beginTime).format('YYYY-MM-DD');
        const durationMinutes = dayjs(exercise.endTime).diff(dayjs(exercise.beginTime), 'minute');

        if (!acc[type]) acc[type] = {};
        if (!acc[type][day]) acc[type][day] = 0;
        acc[type][day] += durationMinutes;

        return acc;
      }, {});
  };

  const prepareChartData = (groupedData) => {
    const daysOfWeek = Array.from({ length: 7 }, (_, i) =>
      dayjs().startOf('isoWeek').add(i, 'day').format('ddd')
    );

    const colorMap = generateColors(Object.keys(groupedData));

    const labels = daysOfWeek; // Days of the week
    const datasets = [];

    Object.entries(groupedData).forEach(([type, dayData]) => {
      const data = daysOfWeek.map((day) => {
        const formattedDay = dayjs().startOf('isoWeek').add(labels.indexOf(day), 'day').format('YYYY-MM-DD');
        return (dayData[formattedDay] || 0) / 60; // Convert minutes to hours
      });

      datasets.push({
        data,
        color: (opacity = 1) => colorMap[type], // Color assignment for each type
        label: type,
      });
    });

    return {
      data: { labels, datasets },
      colorMap,
    };
  };

  const generateColors = (types) => {
    const predefinedColors = [
      '#FF6384', // Red
      '#36A2EB', // Blue
      '#FFCE56', // Yellow
      '#4BC0C0', // Green
      '#9966FF', // Purple
      '#FF9F40', // Orange
      '#E7E9ED', // Grey
    ];

    const colors = {};
    types.forEach((type, index) => {
      colors[type] = predefinedColors[index % predefinedColors.length];
    });
    return colors;
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const screenWidth = Dimensions.get("window").width;

  if (!chartData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10 }}>
        Exercise Duration by Day
      </Text>
      <BarChart
        data={chartData}
        width={screenWidth}
        height={300}
        yAxisSuffix="h"
        chartConfig={chartConfig}
        verticalLabelRotation={30}
        fromZero
        showBarTops={false}
        withHorizontalLabels={true}
      />
    </View>
  );
};

export default ExercisesChart;
