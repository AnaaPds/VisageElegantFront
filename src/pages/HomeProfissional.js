import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomeProfissional.css';
import api from '../services/api'; // <-- IMPORTANTE

function HomeProfissional() {
  const navigate = useNavigate();

  const gerarRelatorio = async () => {
    const idProfissional = localStorage.getItem('idProfissional');

    if (!idProfissional) {
      alert('ID do profissional não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await api.get(`/relatorios/profissional/${idProfissional}`, {
        responseType: 'blob', // para lidar com PDF
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `relatorio_profissional_${idProfissional}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar o relatório. Verifique se você está logado corretamente.');
    }
  };

  return (
    <div className="home-profissional-container">
      <div className="sidebar">
        <img
          src="assets/imagens/home.webp"
          alt="Home"
          onClick={() => navigate('/home-profissional')}
          className="icon"
        />
      </div>

      <div className="conteudo">
        <div className="header">
          <h1>Visage Élégant</h1>
          <img src="assets/imagens/hibisco.png" alt="hibisco" className="hibisco" />
        </div>

        <h2 className="saudacao">Olá Doutor(a)!</h2>

        <div className="botoes">
          <div className="botao" onClick={() => navigate('/consultas-profissional')}>
            <img src="assets/imagens/calendario.webp" alt="Consultas" />
            <p>Consultas</p>
          </div>
          <div className="botao" onClick={gerarRelatorio}>
            <img src="assets/imagens/relatorio.png" alt="Relatório" />
            <p>Relatório</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeProfissional;
