import { useState, useEffect } from "react";

const useExerciseData = (apiData) => {
  const [dataExercicios, setDataExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const transformData = () => {
      const daysOfWeek = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];

      const initialData = daysOfWeek.map((day) => ({
        name: day,
      }));

      const getDayName = (dateString) => {
        const date = new Date(dateString);
        return daysOfWeek[date.getDay()];
      };

      const getDurationInMinutes = (beginTime, endTime) => {
        const begin = new Date(beginTime);
        const end = new Date(endTime);
        return Math.round((end - begin) / 60000);
      };

      apiData.forEach((entry) => {
        const dayName = getDayName(entry.beginTime);
        const duration = getDurationInMinutes(entry.beginTime, entry.endTime);
        const dayData = initialData.find((d) => d.name === dayName);

        if (!dayData) return;

        const type = entry.type;

        if (!dayData[type]) {
          dayData[type] = 0;
        }
        dayData[type] += duration;
      });

      return initialData;
    };

    try {
      const result = transformData();
      setDataExercicios(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiData]);

  return { dataExercicios, loading, error };
};

export default useExerciseData;
