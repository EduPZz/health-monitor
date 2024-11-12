import React from "react";
import "./dashboard.css";
import SmartwatchCard from "../../components/SmartwatchCard";
import CurrentDate from "../../components/CurrentDate";
import { FaChevronRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import api from "../../services/api";
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
import BodyMeasurements from "./components/measures";
import CalcImc from "./components/calcImc";
import {PostProvider} from '../../context/PostContext';

function Dashboard() {
  const dataExercicios = [
    {
      name: "Segunda",
      cardio: 30,
      judo: 80,
      musculacao: 80,
    },
    {
      name: "Terça",
      cardio: 30,
      judo: 60,
      musculacao: 60,
    },
    {
      name: "Quarta",
      cardio: 30,
      judo: 60,
      musculacao: 60,
    },
    {
      name: "Quinta",
      cardio: 30,
      judo: 60,
      musculacao: 60,
    },
    {
      name: "Sexta",
      cardio: 30,
      judo: 60,
      musculacao: 60,
    },
    {
      name: "Sábado",
      cardio: 30,
      judo: 60,
      musculacao: 60,
    },
    {
      name: "Domingo",
      cardio: 30,
      judo: 60,
      musculacao: 60,
    },
  ];

  const [watchCode, setWatchCode] = useState("");
  const [smartwatch, setSmartwatch] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchCode = async () => {
      try {
        const {
          data: { smartwatchCode },
        } = await api.get("auth/profile");
        setWatchCode(smartwatchCode ?? "");

        if (smartwatchCode) {
          setHaveCode(true);
          handlePairing(smartwatchCode ?? "", true);
        }
      } catch (error) {
        console.error("Erro ao buscar o código do smartwatch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchCode();
  }, []);

  useEffect(() => {
    let interval;

    if (smartwatch && watchCode) {
      interval = setInterval(() => {
        handlePairing(watchCode, false);
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [smartwatch, watchCode]);

  const handlePairing = async (watchCode, shouldShowLoading) => {
    try {
      if (shouldShowLoading) setLoading(true);
      const { data } = await api.get(`smartwatch/${watchCode}`);
      setSmartwatch(data);
      setWatchCode(watchCode);
    } catch (error) {
      console.error("Erro", "Não foi possível sincronizar o código");
    } finally {
      setLoading(false);
    }
  };

  const [valueInputWatchCode, setValueInputWatchCode] = useState("");
  const [haveCode, setHaveCode] = useState(false);

  const handleClickWatchCode = async () => {
    handlePairing(valueInputWatchCode, true);
    setHaveCode(true);
  };

  const [consultas, setConsultas] = useState([
    {
      data: new Date("2024-10-01"),
      doutor: "Dr. Fulano",
      especializacao: "Nutricionista",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [novaConsulta, setNovaConsulta] = useState({
    doutor: "",
    especializacao: "",
    data: "",
  });

  const formatarData = (data) => {
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovaConsulta({
      ...novaConsulta,
      [name]: value,
    });
  };

  const addConsulta = () => {
    const novaData = new Date(novaConsulta.data);
    setConsultas([
      ...consultas,
      { data: novaData, doutor: novaConsulta.doutor, especializacao: novaConsulta.especializacao },
    ]);
    setShowModal(false);
    setNovaConsulta({
      doutor: "",
      especializacao: "",
      data: "",
    });
  };

  return (
    <div className="container">
      <div className="content">
        <div className="divWelcome">
          <p className="title">Resumo de sua saúde</p>
          <p className="subTitle">
            <CurrentDate />
          </p>
        </div>

        <div className="divInputWatchcode">
          <input
            type="number"
            className="inputWatchCode"
            placeholder="Insira o código do smartwatch"
            value={valueInputWatchCode}
            onChange={(e) => setValueInputWatchCode(e.target.value)}
          />
          <FaChevronRight
            style={{ fontSize: 20 }}
            onClick={handleClickWatchCode}
          />
        </div>
        {haveCode && smartwatch && <SmartwatchCard smartwatch={smartwatch} />}
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
              data={dataExercicios}
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
        <div className="divProxConsultas">
        <p className="titleProxConsultas">Próximas consultas</p>
        <div className="divInfosProxConsultas">
          {consultas.map((consulta, index) => (
            <div key={index} className="consultaItem">
              <p className="dataProxConsultas">
                {formatarData(consulta.data)}
              </p>
              <p className="docProxConsultas">
                {consulta.doutor} - {consulta.especializacao}
              </p>
            </div>
          ))}
        </div>
        <button className="addConsultasButton" onClick={() => setShowModal(true)}>
          +
        </button>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Adicionar Consulta</h2>
            <input
              type="text"
              name="doutor"
              placeholder="Nome do doutor"
              value={novaConsulta.doutor}
              onChange={handleInputChange}
            />
            <select
              name="especializacao"
              value={novaConsulta.especializacao}
              onChange={handleInputChange}
            >
              <option value="">Selecione a especialização</option>
              <option value="Nutricionista">Nutricionista</option>
              <option value="Cardiologista">Cardiologista</option>
            </select>
            <input
              type="date"
              name="data"
              value={novaConsulta.data}
              onChange={handleInputChange}
            />
            <button className="ok" onClick={addConsulta}>Adicionar</button>
            <button className="cancel" onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
      </div>
      <div className="divMetricas">
        <PostProvider>
          <BodyMeasurements />
          <CalcImc />
        </PostProvider>
      </div>
    </div>
  );
}

export default Dashboard;
