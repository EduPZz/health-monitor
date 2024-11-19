import React, { useState, useEffect } from "react";
import AddExerciseModal from "./AddExerciseModal";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import api from "../../../../services/api";
import useExerciseData from "../../../../hooks/useExerciseData";
import { Button } from "antd";

const generateColorForTypes = (types) => {
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#d3eaf1",
    "#b7e0f4",
    "#cce5ff",
    "#f0f8ff",
    "#faebd7",
    "#e0fff0",
  ];

  const sortedTypes = [...types].sort();
  return sortedTypes.reduce((acc, type, index) => {
    acc[type] = colors[index % colors.length];
    return acc;
  }, {});
};

const ExerciseChart = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    dataExercicios,
    loading: loadingDataTransformation,
    error: dataTransformationError,
  } = useExerciseData(exercises);


  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data } = await api.get("exercise");
        setExercises(data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const addExercise = async (exercise) => {
    try {
      const { data } = await api.post("exercise", {
        ...exercise,
        beginTime: new Date(exercise.beginTime).toISOString(),
        endTime: new Date(exercise.endTime).toISOString(),
      });
      setExercises([...exercises, data]);
    } catch (error) {
      console.error("Failed to add exercise:", error);
    }
  };

  if (loading || loadingDataTransformation) {
    return <div>Carregando...</div>;
  }

  if (dataTransformationError) {
    return <div>Erro ao transformar os dados: {dataTransformationError}</div>;
  }

  const renderCustomBars = () => {
    const types = new Set();

    dataExercicios.forEach((day) => {
      Object.keys(day).forEach((type) => {
        if (type !== "name") {
          types.add(type);
        }
      });
    });

    const colorMap = generateColorForTypes(Array.from(types));

    return Array.from(types).map((type) => (
      <Bar key={type} dataKey={type} stackId="a" fill={colorMap[type]} />
    ));
  };

  return (
    <div className="divEvolucaoExe">
      <header className="headerEvolucao">
        <p className="titleEvolucao">Evolução de exercícios</p>
        <Button color="success" variant="solid" onClick={() => setIsModalOpen(true)}>Adicionar exercício</Button>
      </header>

      {exercises.length ? (
        <ResponsiveContainer width="100%" height="75%">
          <BarChart
            data={dataExercicios}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{ value: "Minutos", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend />
            {renderCustomBars()}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div>Nenhum exercício adicionado</div>
      )}

      <AddExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addExercise}
      />
    </div>
  );
};

export default ExerciseChart;
