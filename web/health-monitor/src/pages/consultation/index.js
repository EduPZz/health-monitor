import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

// Function to adjust the date for the UTC-3 timezone (only for display)
const adjustForTimezone = (date) => {
  const localDate = new Date(date);
  const timezoneOffset = localDate.getTimezoneOffset();
  localDate.setMinutes(localDate.getMinutes() + timezoneOffset + 180);
  return localDate;
};

const ConsultationsWeb = () => {
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConsultation, setNewConsultation] = useState({
    doctorName: "",
    scheduleDate: new Date(),
    specialization: "",
  });
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await api.get("consultation");
        setConsultations(response.data);
      } catch (error) {
        console.error("Falha ao buscar consultas", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConsultation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("consultation", {
        ...newConsultation,
        scheduleDate: new Date(newConsultation.scheduleDate).toISOString(), // Send to the API without the timezone adjustment.
        description: "",
      });
      setConsultations((prev) => [...prev, data]);
      setIsModalOpen(false);
      setNewConsultation({
        doctorName: "",
        scheduleDate: new Date(),
        specialization: "",
      });
    } catch (error) {
      console.error("Falha ao adicionar consulta", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`consultation/${id}`);
      setConsultations(
        consultations.filter((consultation) => consultation.id !== id)
      );
    } catch (error) {
      console.error("Falha ao deletar consulta", error);
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const isConsultationDay = (date) =>
    consultations.some(
      (consultation) => adjustForTimezone(new Date(consultation.scheduleDate)).toISOString().split("T")[0] === date.toISOString().split("T")[0]
    );

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);

    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const hasConsultation = isConsultationDay(date);

      days.push(
        <div
          key={day}
          className={`day ${selectedDate?.toISOString() === date.toISOString() ? "selected" : ""} ${hasConsultation ? "has-consultation" : ""}`}
          onClick={() => setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const filteredConsultations = selectedDate
    ? consultations.filter(
        (consultation) =>
          adjustForTimezone(new Date(consultation.scheduleDate)).toISOString().split("T")[0] === selectedDate.toISOString().split("T")[0]
      )
    : [];

  return (
    <div className="consultations-web">
      <h1>Consultas</h1>
      <div className="calendar-container">
        {/* Calendar header */}
        <div className="header">
          <button onClick={handlePrevMonth}>❮</button>
          <span className="header-span">
            {adjustForTimezone(currentDate).toLocaleDateString("pt-BR", { year: "numeric", month: "long" })}
          </span>
          <button onClick={handleNextMonth}>❯</button>
        </div>

        {/* Days of the week */}
        <div className="days">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        {/* Days of the month */}
        <div className="grid">{renderCalendar()}</div>

        {/* Consults view */}
        <div className="consultations-list">
          {selectedDate ? (
            <>
              <h3>
                Consultas em{" "}
                {adjustForTimezone(selectedDate).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}
              </h3>
              {filteredConsultations.length > 0 ? (
                filteredConsultations.map((consultation) => (
                  <div key={consultation.id} className="consultation-item">
                    <p>Doutor: {consultation.doctorName}</p>
                    <p>Especialização: {consultation.specialization}</p>
                    <p>
                      Data:{" "}
                      {adjustForTimezone(consultation.scheduleDate).toLocaleDateString("pt-BR")}
                    </p>
                    <button className="delete-consultation" onClick={() => handleDelete(consultation.id)}>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                ))
              ) : (
                <p>Nenhuma consulta para este dia.</p>
              )}
            </>
          ) : (
            <p>Selecione um dia para visualizar as consultas.</p>
          )}
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <button className="addConsultation" onClick={() => setIsModalOpen(true)}>Adicionar nova consulta</button>
          </div>
        )}
      </div>

      {/* Modal for adding consultation */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Nova Consulta</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nome do Doutor:
                <input
                  type="text"
                  name="doctorName"
                  value={newConsultation.doctorName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Data:
                <input
                  type="date"
                  name="scheduleDate"
                  value={newConsultation.scheduleDate.toISOString().split("T")[0]}
                  onChange={(e) =>
                    setNewConsultation({
                      ...newConsultation,
                      scheduleDate: new Date(e.target.value),
                    })
                  }
                  required
                />
              </label>
              <label>
                Especialização:
                <input
                  type="text"
                  name="specialization"
                  value={newConsultation.specialization}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button className="addConsultation" type="submit">Salvar consulta</button>
              <button className="cancelConsultationAdd" type="button" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsWeb;
