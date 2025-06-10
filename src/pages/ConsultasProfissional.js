import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ConsultasProfissional.css';

function ConsultasProfissional() {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [detalhesVisiveis, setDetalhesVisiveis] = useState({});
  const [filtroNome, setFiltroNome] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [cancelando, setCancelando] = useState(new Set());

  useEffect(() => {
    const idProfissional = localStorage.getItem("idProfissional");

    if (!idProfissional) {
      alert("ID do profissional não encontrado. Faça login novamente.");
      return;
    }

    fetch("http://localhost:8080/consultas/profissional/" + idProfissional)
      .then(async (res) => {
        if (res.status === 204) return [];
        if (!res.ok) throw new Error('Erro ao carregar consultas');
        const data = await res.json();
        return data;
      })
      .then((data) => {
        setConsultas(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error(err);
        alert('Erro ao carregar consultas');
        setCarregando(false);
      });
  }, []);

  const cancelarConsulta = (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta consulta?')) return;

    setCancelando(prev => new Set(prev).add(id));

    fetch("http://localhost:8080/consultas/" + id, { method: 'DELETE' })
      .then(res => {
        setCancelando(prev => {
          const nova = new Set(prev);
          nova.delete(id);
          return nova;
        });
        if (res.status === 204) {
          setConsultas(prev => prev.filter(c => c.id !== id));
        } else {
          alert('Erro ao cancelar consulta');
        }
      })
      .catch(() => {
        setCancelando(prev => {
          const nova = new Set(prev);
          nova.delete(id);
          return nova;
        });
        alert('Erro ao cancelar consulta');
      });
  };

  const toggleDetalhes = (index) => {
    setDetalhesVisiveis(prev => {
      const novo = {...prev};
      novo[index] = !novo[index];
      return novo;
    });
  };

  const consultasFiltradas = consultas.filter((consulta) => {
    const nomePaciente = consulta.paciente && consulta.paciente.nome ? consulta.paciente.nome : '';
    const dataFormatada = consulta.dataHora ? consulta.dataHora.slice(0, 10) : '';
    const nomeMatch = nomePaciente.toLowerCase().includes(filtroNome.toLowerCase());
    const dataMatch = filtroData === '' || dataFormatada === filtroData;
    return nomeMatch && dataMatch;
  });

  return React.createElement(
    'div',
    { className: 'consultas-profissional-container' },
    React.createElement(
      'div',
      { className: 'sidebar' },
      React.createElement('img', {
        src: '/assets/imagens/home.webp',
        alt: 'Home',
        onClick: () => navigate('/home-profissional'),
        className: 'icon',
        style: { cursor: 'pointer' }
      })
    ),

    React.createElement(
      'div',
      { className: 'conteudo' },
      React.createElement(
        'div',
        { className: 'header' },
        React.createElement('h1', null, 'Visage Élégant'),
        React.createElement('img', {
          src: '/assets/imagens/hibisco.png',
          alt: 'hibisco',
          className: 'hibisco'
        })
      ),

      React.createElement(
        'div',
        { className: 'consultas' },
        React.createElement('h2', null, 'Consultas'),

        React.createElement(
          'div',
          { className: 'filtros' },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Filtrar por nome',
            value: filtroNome,
            onChange: (e) => setFiltroNome(e.target.value)
          }),
          React.createElement('input', {
            type: 'date',
            value: filtroData,
            onChange: (e) => setFiltroData(e.target.value)
          })
        ),

        carregando
          ? React.createElement('p', null, 'Carregando consultas...')
          : consultasFiltradas.length === 0
            ? React.createElement('p', null, 'Não há consultas encontradas.')
            : consultasFiltradas.map((consulta, index) => {
                const data = new Date(consulta.dataHora);
                const dataFormatada = data.toLocaleDateString('pt-BR');
                const horaFormatada = data.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return React.createElement(
                  'div',
                  { className: 'consulta-card', key: consulta.id },
                  React.createElement('h3', null, consulta.procedimento || 'Procedimento não informado'),
                  React.createElement('p', null,
                    React.createElement('strong', null, 'Nome: '),
                    consulta.paciente?.nome || 'Nome não disponível'
                  ),
                  React.createElement('p', null,
                    React.createElement('strong', null, 'Data: '),
                    consulta.dataHora ? `${dataFormatada} às ${horaFormatada}` : 'Data não informada'
                  ),

                  detalhesVisiveis[index] && React.createElement(
                    'div',
                    { className: 'detalhes' },
                    React.createElement('p', null,
                      React.createElement('strong', null, 'Telefone: '),
                      consulta.paciente?.telefone || 'Telefone não informado'
                    ),
                    React.createElement('p', null,
                      React.createElement('strong', null, 'Observações: '),
                      consulta.observacoes || 'Nenhuma'
                    )
                  ),

                  React.createElement(
                    'div',
                    { className: 'botoes' },
                    React.createElement(
                      'button',
                      { onClick: () => toggleDetalhes(index) },
                      detalhesVisiveis[index] ? 'Ocultar' : 'Ver mais'
                    ),
                    React.createElement(
                      'button',
                      {
                        onClick: () => cancelarConsulta(consulta.id),
                        disabled: cancelando.has(consulta.id)
                      },
                      cancelando.has(consulta.id) ? 'Cancelando...' : 'Cancelar'
                    )
                  )
                );
              })
      )
    )
  );
}

export default ConsultasProfissional;
