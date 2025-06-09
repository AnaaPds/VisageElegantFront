import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/Global.css';

// Importando páginas
import EscolherTipoUsuario from './pages/EscolherTipoUsuario';
import CadastroPaciente from './pages/CadastroPaciente';
import CadastroProfissional from './pages/CadastroProfissional';
import LoginPaciente from './pages/LoginPaciente';
import LoginProfissional from './pages/LoginProfissional';
import HomePaciente from './pages/HomePaciente';
import HomeProfissional from './pages/HomeProfissional';
import ConsultasProfissional from './pages/ConsultasProfissional';
import RelatorioProfissional from './pages/RelatorioProfissional';
import VerConsultasPaciente from './pages/VerConsultasPaciente';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Tela inicial */}
        <Route path="/" element={<EscolherTipoUsuario />} />

        {/* Cadastro */}
        <Route path="/cadastro-paciente" element={<CadastroPaciente />} />
        <Route path="/cadastro-profissional" element={<CadastroProfissional />} />

        {/* Login */}
        <Route path="/login-paciente" element={<LoginPaciente />} />
        <Route path="/login-profissional" element={<LoginProfissional />} />

        {/* Home */}
        <Route path="/home-paciente" element={<HomePaciente />} />
        <Route path="/home-profissional" element={<HomeProfissional />} />

        {/* Consultas e relatórios */}
        <Route path="/consultas-profissional" element={<ConsultasProfissional />} />
        <Route path="/relatorio-profissional" element={<RelatorioProfissional />} />
        <Route path="/ver-consultas-paciente" element={<VerConsultasPaciente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
