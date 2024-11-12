import React from 'react';
import './ImcResult.css';

const ImcResult = ({ imc }) => {
  let status = 'Você está saudável';
  if (imc < 18.5) status = 'Abaixo do peso';
  else if (imc > 24.9) status = 'Sobrepeso';

  return (
    <div className="imc-result">
      <h3>Índice de massa corporal (IMC)</h3>
      <h1>{imc}</h1>
      <button className="status-button">{status}</button>
      <div className="imc-bar">
        <div className="bar-gradient"></div>
        <div className="indicator" style={{ left: `${(imc - 15) * 100 / 25}%` }}></div>
      </div>
    </div>
  );
};

export default ImcResult;
