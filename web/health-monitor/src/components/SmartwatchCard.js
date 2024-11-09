import React from "react";
import "./SmartwatchCard.css";
import { FaThermometer, FaHeartbeat } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";

function HealthCard({ value, unit, label, icon, color, description }) {
    return (
        <div className="divMonitoramento">
            <header className="headerMonitoramento">
                <div
                    className="iconMonitoramento"
                    style={{ backgroundColor: color }}
                >
                    {icon}
                </div>
                <p className="titleMonitoramento">{label}</p>
            </header>
            <div className="divDados">
                <p className="numberDados">{value}</p>
                <p className="tipoDado">{unit}</p>
            </div>
            <div className="divStatus" style={{ backgroundColor: color }}>
                {description}
            </div>
        </div>
    )
}

const SmartwatchCards = ({ smartwatch }) => {
    console.log('smartwatch dentro do componente', smartwatch)
    const getBloodGlucoseStatus = (value) => {
        if (value < 70) return "Baixo";
        if (value > 140) return "Alto";
        return "Normal";
    };

    const getHeartbeatStatus = (value) => {
        if (value < 60) return "Baixo";
        if (value > 100) return "Alto";
        return "Normal";
    };

    const getBloodPressureStatus = (systolic, diastolic) => {
        if (systolic < 90 || diastolic < 60) return "Baixo";
        if (systolic > 120 || diastolic > 80) return "Alto";
        return "Normal";
    };

    return (
        <div className="divMonitoramentosWatch">
            <HealthCard
                value={smartwatch.bloodGlucose}
                unit="mg / dl"
                label="Glicemia"
                color="#F8DEBD"
                description={getBloodGlucoseStatus(smartwatch.bloodGlucose)}
                icon={<FaThermometer style={{ fontSize: "30px", color: "#E79B38" }} />}
            />
            <HealthCard
                value={smartwatch.heartbeat}
                unit="bpm"
                label="Batimento cardíaco"
                color="#FBF0F3"
                description={getHeartbeatStatus(smartwatch.heartbeat)}
                icon={<FaHeartbeat style={{ fontSize: "30px", color: "#CA6B6E" }} />}
            />
            <HealthCard
                value={`${smartwatch.systolic}/${smartwatch.diastolic}`}
                unit="mmhg"
                label="Pressão do sangue"
                color="#D0FBFF"
                description={getBloodPressureStatus(smartwatch.systolic, smartwatch.diastolic)}
                icon={<MdBloodtype style={{ fontSize: "30px", color: "#478F96" }} />}
            />
        </div>
    )
}

export default SmartwatchCards;