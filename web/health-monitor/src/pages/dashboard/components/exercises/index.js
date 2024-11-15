import React from "react";
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

const ExerciseChart = ({ data }) => {
  return (
    <div className="divEvolucaoExe">
      <header className="headerEvolucao">
        <p className="titleEvolucao">Evolução de exercícios</p>
        <select className="selectEvolucao">
          <option>Jan 2024</option>
        </select>
      </header>
      <ResponsiveContainer width="100%" height="75%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="judo" stackId="a" fill="#8884d8" />
          <Bar dataKey="cardio" stackId="a" fill="#82ca9d" />
          <Bar dataKey="musculacao" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExerciseChart;
