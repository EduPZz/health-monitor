import React from "react";
import "./dashboard.css";
import { FaThermometer, FaHeartbeat } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import {
    AreaChart,
    Area,
    ResponsiveContainer,
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
    const data = [
        {
            name: 'Page A',
            uv: 1000,
            pv: 1400,
            amt: 2100,
        },
        {
            name: 'Page B',
            uv: 1400,
            pv: 1600,
            amt: 2210,
        },
        {
            name: 'Page C',
            uv: 1200,
            pv: 1500,
            amt: 2290,
        },
        {
            name: 'Page D',
            uv: 1700,
            pv: 3908,
            amt: 2000,
        },
        {
            name: 'Page E',
            uv: 1300,
            pv: 4800,
            amt: 2181,
        },
    ];

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
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                width={200}
                                height={60}
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 20,
                                    bottom: 10,
                                }}
                            >
                                <Area
                                    type="monotone"
                                    dataKey="uv"
                                    stroke="#F3A53F"
                                    fill="#F8DEBD"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
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
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                width={200}
                                height={60}
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 20,
                                    bottom: 10,
                                }}
                            >
                                <Area
                                    type="monotone"
                                    dataKey="uv"
                                    stroke="#CA6B6E"
                                    fill="#E28F92"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
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
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                width={200}
                                height={60}
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 20,
                                    bottom: 10,
                                }}
                            >
                                <Area
                                    type="monotone"
                                    dataKey="uv"
                                    stroke="#478F96"
                                    fill="#D0FBFF"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="divMetricas"></div>
        </div>
    );
}

export default Dashboard;
