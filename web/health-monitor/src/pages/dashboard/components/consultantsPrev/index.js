import React, { useEffect, useState } from "react";
import api from "../../../../services/api";
import "./styles.css";
import { MdAdd } from "react-icons/md";
import { Alert } from "antd";

const ConsultationsPrev = () => {
  const [latestConsultation, setLatestConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConsultation, setNewConsultation] = useState({
    doctorName: "",
    scheduleDate: new Date(),
    specialization: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConsultation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("consultation", {
        ...newConsultation,
        scheduleDate: new Date(newConsultation.scheduleDate).toISOString(),
        description: "",
      });
      setIsModalOpen(false);
      setLatestConsultation(data);
      setNewConsultation({
        doctorName: "",
        scheduleDate: new Date(),
        specialization: "",
      });
    } catch (error) {
      console.error("Failed to add consultation:", error);
      Alert("Unable to schedule consultation.");
    }
  };

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const { data } = await api.get("consultation");

        if (data.length === 0) {
          setLatestConsultation(null);
          return;
        }

        const sortedConsultations = data.sort(
          (a, b) => new Date(b.scheduleDate) - new Date(a.scheduleDate)
        );

        setLatestConsultation(sortedConsultations[0]);
      } catch (error) {
        console.error("Error fetching consultations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
  };

  return (
    <div className="divProxConsultas">
      <div className="proxConsultasDetalhes">
        <p className="titleProxConsultas">Próximas consultas</p>
        {loading ? (
          <p>Loading...</p>
        ) : latestConsultation ? (
          <div className="divInfosProxConsultas">
            <p className="dataProxConsultas">
              {new Date(latestConsultation.scheduleDate).toLocaleDateString(
                "pt-BR",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
            <p className="docProxConsultas">
              Consulta com {latestConsultation.doctorName}
            </p>
          </div>
        ) : (
          <>
            <p>
              Nenhuma consulta encontrada, mas você pode adicionar uma aqui:
            </p>
            <button className="addConsultationButton" onClick={openModal}>
              <MdAdd size={24} />
            </button>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h2>Schedule New Consultation</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Data:
                <input
                  type="date"
                  name="scheduleDate"
                  required
                  value={
                    newConsultation.scheduleDate.toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    setNewConsultation({
                      ...newConsultation,
                      scheduleDate: new Date(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Nome do doutor:
                <input
                  type="text"
                  name="doctorName"
                  required
                  value={newConsultation.doctorName}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Especialização:
                <input
                  type="text"
                  name="specialization"
                  value={newConsultation.specialization}
                  required
                  onChange={handleInputChange}
                />
              </label>
              <button className="closeModalButton" onClick={closeModal}>
                Fechar
              </button>
              <button type="submit">Salvar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPrev;
