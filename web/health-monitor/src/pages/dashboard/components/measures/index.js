import React, { useEffect, useState, useContext } from "react";
import "./styles.css";
import api from "../../../../services/api";
import {PostContext} from '../../../../context/PostContext'

const measurementsModel = {
  chest: "",
  arm: "",
  waist: "",
  thigh: "",
  hip: "",
  calf: "",
  weight: "",
  height: "",
};

function BodyMeasurements() {
  const [lastMeasurements, setLastMeasurements] = useState(measurementsModel);
  const [penultimateMeasurements, setPenultimateMeasurements] = useState(measurementsModel);
  const [measureNotCreatedYet, setMeasurementNotCreatedYet] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editMeasurements, setEditMeasurements] = useState(measurementsModel);
  const { setIsPostSuccessful } = useContext(PostContext);

  useEffect(() => {
    const fetchMeasures = async () => {
      try {
        const { data } = await api.get("body-measure");

        if (data.length === 0) {
          setMeasurementNotCreatedYet(true);
          return;
        }

        const sortedBodyMeasure = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setLastMeasurements(sortedBodyMeasure[0]);
        setEditMeasurements(sortedBodyMeasure[0]);
        setMeasurementNotCreatedYet(false);

        if (sortedBodyMeasure.length > 1) {
          setPenultimateMeasurements(sortedBodyMeasure[1]);
        }
      } catch (error) {
        console.error("Erro ao buscar as medidas corporais:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasures();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("body-measure", {
        ...serializedLastMeasurements(editMeasurements),
      });
      setLastMeasurements(data);
      setEditMeasurements(data);
      setMeasurementNotCreatedYet(false);
      setIsEditing(false);
      setIsPostSuccessful(true);
    } catch (error) {
      console.log("Erro", "Não foi possível salvar as medidas");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMeasurements(lastMeasurements);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditMeasurements((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getIndicator = (current, previous) => {
    if (!previous) return null;
    return current > previous ? "↑" : current < previous ? "↓" : null;
  };

  const serializedLastMeasurements = (measurement) => {
    return {
      chest: measurement.chest,
      arm: measurement.arm,
      thigh: measurement.thigh,
      hip: measurement.hip,
      calf: measurement.calf,
      weight: measurement.weight,
      height: measurement.height,
      waist: measurement.waist,
    };
  };

  const measurementTranslate = {
    chest: "Peito (cm)",
    arm: "Braço (cm)",
    waist: "Cintura (cm)",
    thigh: "Coxa (cm)",
    hip: "Quadril (cm)",
    calf: "Panturrilha (cm)",
    weight: "Peso (kg)",
    height: "Altura (m)",
  };

  const daysSinceLastUpdate = lastMeasurements.createdAt
    ? Math.floor(
        (new Date() - new Date(lastMeasurements.createdAt)) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="bodyMeasurements">
      {loading ? <p>Loading...</p> : null}
      <h3>Medidas Corporais</h3>
      <h5>Ultima atualização há {daysSinceLastUpdate || "N/A"} dias</h5>
      {isEditing ? (
        <>
          <button className="measurementsEditButton" onClick={handleSave} disabled={loading}>
            Salvar
          </button>
          <button className="measurementsEditButton" onClick={handleCancel}>
            Cancelar
          </button>
        </>
      ) : (
        <button className="measurementsEditButton" onClick={() => setIsEditing(true)} disabled={loading}>
          Editar medidas
        </button>
      )}
      <ul className="measurementsCardContainer">
        {Object.keys(serializedLastMeasurements(lastMeasurements)).map((key) => (
          <li
            key={key}
            className={
              key === "chest" || key === "thigh" || key === "calf" || key === "height"
                ? "align-end"
                : "align-start"
            }
          >
            <p>{measurementTranslate[key]}</p>
            {isEditing ? (
              <input
                type="text"
                name={key}
                value={editMeasurements[key]}
                onChange={handleChange}
              />
            ) : (
              <p>
                {lastMeasurements[key]}{" "}
                {getIndicator(lastMeasurements[key], penultimateMeasurements[key]) && (
                  <span
                    className={
                      getIndicator(lastMeasurements[key], penultimateMeasurements[key]) === "↑"
                        ? "indicatorIncrease"
                        : "indicatorDecrease"
                    }
                  >
                    {getIndicator(lastMeasurements[key], penultimateMeasurements[key])}
                  </span>
                )}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BodyMeasurements;
