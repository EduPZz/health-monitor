import React from "react";
import './dashboard.css';

function CurrentDate() {
    const currentDate = new Date();
  
    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
  
    const day = currentDate.getDate();
    const month = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();
  
    const fullDate = `${day} de ${month} de ${year}`;
    
    return fullDate;
}

function Dashboard() {
    return (   
        <div className="container">
            <div className="content">
                <div className="divWelcome">
                    <p className="title">Resumo de sua saúde</p>
                    <p className="subTitle"><CurrentDate /></p>
                </div>
            </div>
            <div className="divMetricas">

            </div>
        </div>
    );
}


export default Dashboard;