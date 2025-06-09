import React from 'react';
import '../styles/EscolherTipoUsuario.css';
import { useNavigate } from 'react-router-dom';

function EscolherTipoUsuario() {
  const navigate = useNavigate();

  return (
    <div className="escolher-container">

      <div className="header">
        <h1>Visage Élégant</h1>
        <img
          src="/assets/imagens/hibisco.png"
          alt="Logo"
          className="logo-hibisco"
        />
      </div>

      <h2>Bem-vinda(o)! Como deseja acessar?</h2>

      <div className="opcoes">
        <div className="card" onClick={() => navigate('/cadastro-paciente')}>
          <img src="/assets/imagens/boneco.png" alt="Paciente" />
          <span>Paciente</span>
        </div>

        <div className="card" onClick={() => navigate('/cadastro-profissional')}>
          <img src="/assets/imagens/boneco.png" alt="Profissional" />
          <span>Profissional</span>
        </div>
      </div>

    </div>
  );
}

export default EscolherTipoUsuario;
