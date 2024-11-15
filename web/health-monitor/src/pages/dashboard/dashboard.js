import React, { useState, useEffect } from "react";
import "./dashboard.css";
import SmartwatchCard from "../../components/SmartwatchCard";
import CurrentDate from "../../components/CurrentDate";
import { FaChevronRight } from "react-icons/fa";
import api from "../../services/api";
import BodyMeasurements from "./components/measures";
import CalcImc from "./components/calcImc";
import { PostProvider } from '../../context/PostContext';
import ConsultationsPrev from "./components/consultantsPrev";
import ExerciseChart from "./components/exercises";

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
        <ExerciseChart data={dataExercicios} />
        <ConsultationsPrev />
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
