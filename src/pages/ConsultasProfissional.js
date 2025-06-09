import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ConsultasProfissional.css';

function ConsultasProfissional() {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [detalhesVisiveis, setDetalhesVisiveis] = useState({});
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroData, setFiltroData] = useState('');

  const API_BASE = "http://localhost:8080/consultas";

  useEffect(() => {
    const idProfissional = localStorage.getItem("idProfissional");
    if (!idProfissional) {
      alert("ID do profissional não encontrado. Faça login novamente.");
      return;
    }

    fetch(`${API_BASE}/profissional/${idProfissional}`)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar consultas');
        return res.json();
      })
      .then(data => setConsultas(data))
      .catch(err => console.error(err));
  }, []);

  const cancelarConsulta = (id) => {
    fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.status === 204) {
          setConsultas(prev => prev.filter(c => c.id !== id));
        } else {
          alert('Erro ao cancelar consulta');
        }
      })
      .catch(() => alert('Erro ao cancelar consulta'));
  };

  const toggleDetalhes = (index) => {
    setDetalhesVisiveis(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const consultasFiltradas = consultas.filter(consulta => {
    const nomePaciente = consulta.paciente?.nome || '';
    const dataHora = consulta.dataHora || '';
    const nomeMatch = nomePaciente.toLowerCase().includes(filtroNome.toLowerCase());
    const dataMatch = dataHora.includes(filtroData);
    return nomeMatch && (filtroData === '' || dataMatch);
  });

  return (
    <div className="consultas-profissional-container">
      <div className="sidebar">
        <img
          src="assets/imagens/home.webp"
          alt="Home"
          onClick={() => navigate('/home-profissional')}
          className="icon"
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="conteudo">
        <div className="header">
          <h1>Visage Élégant</h1>
          <img src="assets/imagens/hibisco.png" alt="hibisco" className="hibisco" />
        </div>

        <div className="consultas">
          <h2>Consultas</h2>

          <div className="filtros">
            <input
              type="text"
              placeholder="Filtrar por nome"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
            />
            <input
              type="date"
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
            />
          </div>

          {consultasFiltradas.length === 0 ? (
            <p>Não há consultas encontradas.</p>
          ) : (
            consultasFiltradas.map((consulta, index) => (
              <div className="consulta-card" key={consulta.id}>
                <h3>{consulta.procedimento || 'Procedimento não informado'}</h3>
                <p><strong>Nome:</strong> {consulta.paciente?.nome || 'Nome não disponível'}</p>
                <p><strong>Data:</strong> {consulta.dataHora ? new Date(consulta.dataHora).toLocaleString('pt-BR') : 'Data não informada'}</p>

                {detalhesVisiveis[index] && (
                  <div className="detalhes">
                    <p><strong>Telefone:</strong> {consulta.paciente?.telefone || 'Telefone não informado'}</p>
                    <p><strong>Observações:</strong> {consulta.observacoes || 'Nenhuma'}</p>
                  </div>
                )}

                <div className="botoes">
                  <button onClick={() => toggleDetalhes(index)}>
                    {detalhesVisiveis[index] ? 'Ocultar' : 'Ver mais'}
                  </button>
                  <button onClick={() => cancelarConsulta(consulta.id)}>Cancelar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ConsultasProfissional;
