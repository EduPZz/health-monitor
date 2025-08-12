import { useState, useEffect } from "react";

export const useExerciseFilter = (exercises) => {
  const [selectedDateRange, setSelectedDateRange] = useState("week");
  const [filteredExercises, setFilteredExercises] = useState([]);

  useEffect(() => {
    const filterExercises = () => {
      const now = new Date();
      let startDate;

      switch (selectedDateRange) {
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      const filtered = exercises.filter(
        (exercise) => new Date(exercise.beginTime) >= startDate
      );
      setFilteredExercises(filtered);
    };

    filterExercises();
  }, [exercises, selectedDateRange]);

  const getWeekLabel = (date) => {
    const d = new Date(date);

    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const format = (dt) =>
      dt.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });

    return `${format(start)} – ${format(end)}`;
  };

  const getDivedData = (range, exercises) => {
    const result = {};
    const exerciseTypes = {};

    exercises.forEach((exercise) => {
      let date;

      switch (range) {
        case "month":
          date = getWeekLabel(exercise.beginTime);
          break;
        case "week":
          date = new Date(exercise.beginTime).toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "short",
          });
          break;
        case "year":
          date = new Date(exercise.beginTime).toLocaleDateString("pt-BR", {
            month: "short",
          });
          break;
        default:
          break;
      }

      const duration =
        (new Date(exercise.endTime) - new Date(exercise.beginTime)) /
        (1000 * 60);

      if (!result[date]) {
        result[date] = { date, total: 0 };
      }
      if (!exerciseTypes[exercise.type]) {
        exerciseTypes[exercise.type] = 0;
      }

      result[date].total += duration;
      exerciseTypes[exercise.type] += duration;
    });

    return { result, exerciseTypes };
  };

  const transformExercisesForChart = () => {
    const { result: data, exerciseTypes } = getDivedData(
      selectedDateRange,
      filteredExercises
    );

    const sortedData = Object.values(data).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

    return {
      data: sortedData
        ? sortedData?.map((day) => ({
            date: day.date,
            total: Math.round(day.total),
            data: [Math.round(day.total)],
          }))
        : [],
      exerciseTypes: Object.entries(exerciseTypes)
        .sort(([, a], [, b]) => b - a)
        ?.map(([type, duration]) => ({
          type,
          duration: Math.round(duration),
          data: [Math.round(duration)],
        })),
    };
  };

  const formatChartData = (dataArray, labelKey, valueKey) => {
    return {
      labels: dataArray.map((item) => item[labelKey]),
      datasets: [
        {
          data: dataArray.map((item) => item[valueKey]),
        },
      ],
    };
  };

  const chartData = transformExercisesForChart();
  const chartDataFormatted = formatChartData(chartData.data, "date", "total");
  const typesChartFormatted = formatChartData(
    chartData.exerciseTypes,
    "type",
    "duration"
  );

  const averagePerBucketTime =
    chartData.data.length > 0
      ? Math.round(
          chartData.data.reduce((sum, day) => sum + day.total, 0) /
            chartData.data.length
        )
      : 0;

  const averageHours = Math.floor(averagePerBucketTime / 60);
  const averageMinutes = averagePerBucketTime % 60;

  return {
    selectedDateRange,
    setSelectedDateRange,
    filteredExercises,
    chartData,
    chartDataFormatted,
    typesChartFormatted,
    averageHours,
    averageMinutes,
  };
};
