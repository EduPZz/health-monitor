import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./styles.css";

const ConsultationsWeb = () => {
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConsultation, setNewConsultation] = useState({
    doctorName: "",
    scheduleDate: new Date(),
    specialization: "",
  });

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await api.get("consultation");
        setConsultations(response.data);
      } catch (error) {
        console.error("Failed to fetch consultations:", error);
        alert("Unable to load consultations.");
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
        scheduleDate: new Date(newConsultation.scheduleDate).toISOString(),
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
      console.error("Failed to add consultation:", error);
      alert("Unable to schedule consultation.");
    }
  };

  return (
    <div className="consultations-web">
      <h1>Consultations</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <button onClick={() => setIsModalOpen(true)}>
            Add New Consultation
          </button>
          <div className="consultations-list">
            {consultations.map((consultation) => (
              <div key={consultation.id} className="consultation-item">
                <p>Doctor: {consultation.doctorName}</p>
                <p>
                  Date:{" "}
                  {new Date(consultation.scheduleDate).toLocaleDateString(
                    "pt-BR",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>
                <p>Specialization: {consultation.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for adding consultation */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>New Consultation</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Doctor Name:
                <input
                  type="text"
                  name="doctorName"
                  value={newConsultation.doctorName}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Date:
                <input
                  type="date"
                  name="scheduleDate"
                  value={
                    newConsultation.scheduleDate.toISOString().split("T")[0]
                  }
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
                Specialization:
                <input
                  type="text"
                  name="specialization"
                  value={newConsultation.specialization}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">Save Consultation</button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationsWeb;
