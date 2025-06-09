import React from 'react';
import '../styles/HomePaciente.css';

function ProcedimentoCard({ imagem, titulo, onAgendar }) {
  return (
    <div className="procedimento-card">
      <img src={imagem} alt={titulo} className="imagem-procedimento" />
      <h3>{titulo}</h3>
      <button onClick={onAgendar}>Agendar Consulta</button>
    </div>
  );
}

export default ProcedimentoCard;
