import React from 'react';
import '../styles/HomePaciente.css';
import { useNavigate } from 'react-router-dom';

function NavbarPaciente() {
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="nav-icons">
        <img
          src="/assets/imagens/home.webp"
          alt="Home"
          onClick={() => navigate('/home-paciente')}
        />
        <img
          src="/assets/imagens/consultas.jpg"
          alt="Consultas"
          onClick={() => navigate('/ver-consultas-paciente')}
        />
      </div>
    </div>
  );
}

export default NavbarPaciente;
