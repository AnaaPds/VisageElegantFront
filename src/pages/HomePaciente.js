import React, { useState } from 'react';
import NavbarPaciente from '../components/NavbarPaciente';
import ProcedimentoCard from '../components/ProcedimentoCard';
import ModalAgendar from '../components/ModalAgendar';
import '../styles/HomePaciente.css';

function HomePaciente() {
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState(null);

  const handleAgendar = (procedimento) => {
    setProcedimentoSelecionado(procedimento);
  };

  const handleConfirmarAgendamento = (data) => {
    alert(`Consulta de ${procedimentoSelecionado} agendada para ${data}`);
    setProcedimentoSelecionado(null);
  };

  return (
    <div className="home-container">
      <NavbarPaciente />

      <div className="home-content">
        <header className="header">
          <h1>Visage Élégant</h1>
          <img
            src="/assets/imagens/hibisco.png"
            alt="Logo Hibisco"
            className="hibisco"
          />
        </header>

        <div className="procedimentos">
          <ProcedimentoCard
            imagem="/assets/imagens/preenchimentofacial.png"
            titulo="Preenchimento Facial"
            onAgendar={() => handleAgendar('Preenchimento Facial')}
          />
          <ProcedimentoCard
            imagem="/assets/imagens/botox.jpeg"
            titulo="Botox"
            onAgendar={() => handleAgendar('Botox')}
          />
          <ProcedimentoCard
            imagem="/assets/imagens/laser.jpg"
            titulo="Laser"
            onAgendar={() => handleAgendar('Laser')}
          />
          <ProcedimentoCard
            imagem="/assets/imagens/harmonização.webp"
            titulo="Harmonização Facial"
            onAgendar={() => handleAgendar('Harmonização Facial')}
          />
          <ProcedimentoCard
            imagem="/assets/imagens/limpezadepele.jpg"
            titulo="Limpeza de Pele"
            onAgendar={() => handleAgendar('Limpeza de Pele')}
          />
          <ProcedimentoCard
            imagem="/assets/imagens/microagulhamento.jpg"
            titulo="Microagulhamento"
            onAgendar={() => handleAgendar('Microagulhamento')}
          />
        </div>
      </div>

      {procedimentoSelecionado && (
        <ModalAgendar
          procedimento={procedimentoSelecionado}
          onClose={() => setProcedimentoSelecionado(null)}
          onConfirm={handleConfirmarAgendamento}
        />
      )}
    </div>
  );
}

export default HomePaciente;
