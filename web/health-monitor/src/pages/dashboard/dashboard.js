import React from "react";
import "./dashboard.css";
import { FaThermometer, FaHeartbeat } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
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
    Legend
} from "recharts";

function CurrentDate() {
    const currentDate = new Date();

    const monthNames = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ];

    const day = currentDate.getDate();
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    const fullDate = `${day} de ${month} de ${year}`;

    return fullDate;
}

function Dashboard() {
    const dataExercicios = [
        {
            name: 'Segunda',
            cardio: 30,
            judo: 80,
            musculacao: 80,
        },
        {
            name: 'Terça',
            cardio: 30,
            judo: 60,
            musculacao: 60,
        },
        {
            name: 'Quarta',
            cardio: 30,
            judo: 60,
            musculacao: 60,
        },
        {
            name: 'Quinta',
            cardio: 30,
            judo: 60,
            musculacao: 60,
        },
        {
            name: 'Sexta',
            cardio: 30,
            judo: 60,
            musculacao: 60,
        },
        {
            name: 'Sábado',
            cardio: 30,
            judo: 60,
            musculacao: 60,
        },
        {
            name: 'Domingo',
            cardio: 30,
            judo: 60,
            musculacao: 60,
        }
    ];

    const [dados, setDados] = useState([]);

    useEffect(() => {
        const fetchDados = async () => {
            try{
                const { data } = await api.get("/body-measure/");
                setDados(data);
                console.log("dentro do fetchdados",data);
            } catch(error) {
                console.log("erro dentro do catch",error.message);
            }
        };
        
        fetchDados();
    }, []);

    console.log("Dados", dados);

    return (
        <div className="container">
            <div className="content">
                <div className="divWelcome">
                    <p className="title">Resumo de sua saúde</p>
                    <p className="subTitle">
                        <CurrentDate />
                    </p>
                </div>
                <div className="divMonitoramentosWatch">
                    <div className="divMonitoramento">
                        <header className="headerMonitoramento">
                            <div
                                className="iconMonitoramento"
                                style={{ backgroundColor: "#F8DEBD" }}
                            >
                                <FaThermometer style={{ color: "#E79B38", fontSize: "30px" }} />
                            </div>
                            <p className="titleMonitoramento">Glicemia</p>
                        </header>
                        <div className="divDados">
                            <p className="numberDados">80</p>
                            <p className="tipoDado">mg / dl</p>
                        </div>
                        <div className="divStatus" style={{ backgroundColor: "#F8DEBD" }}>
                            Normal
                        </div>
                    </div>
                    <div className="divMonitoramento">
                        <header className="headerMonitoramento">
                            <div
                                className="iconMonitoramento"
                                style={{ backgroundColor: "#FBF0F3" }}
                            >
                                <FaHeartbeat style={{ color: "#CA6B6E", fontSize: "30px" }} />
                            </div>
                            <p className="titleMonitoramento">Batimento cardíaco</p>
                        </header>
                        <div className="divDados">
                            <p className="numberDados">98</p>
                            <p className="tipoDado">bpm</p>
                        </div>
                        <div className="divStatus" style={{ backgroundColor: "#FBF0F3" }}>
                            Normal
                        </div>
                    </div>
                    <div className="divMonitoramento">
                        <header className="headerMonitoramento">
                            <div
                                className="iconMonitoramento"
                                style={{ backgroundColor: "#D0FBFF" }}
                            >
                                <MdBloodtype style={{ color: "#478F96", fontSize: "30px" }} />
                            </div>
                            <p className="titleMonitoramento">Batimento cardíaco</p>
                        </header>
                        <div className="divDados">
                            <p className="numberDados">102</p>
                            <p className="tipoDado">/ 72 mmhg</p>
                        </div>
                        <div className="divStatus" style={{ backgroundColor: "#D0FBFF" }}>
                            Normal
                        </div>
                    </div>
                </div>
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
                        <p className="dataProxConsultas">01 de outubro de 2024</p>
                        <p className="docProxConsultas">Consulta com Dr.Fulano</p>
                    </div>
                </div>
            </div>
            <div className="divMetricas"></div>
        </div>
    );
}

export default Dashboard;
