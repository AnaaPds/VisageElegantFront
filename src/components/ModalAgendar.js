import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ModalAgendar.css';

function ModalAgendar({ procedimento, onClose, onConfirm }) {
  const nomeSalvo = localStorage.getItem('pacienteNome');
  const [especialidade, setEspecialidade] = useState('');
  const [profissional, setProfissional] = useState('');
  const [nome, setNome] = useState(nomeSalvo && nomeSalvo !== 'undefined' ? nomeSalvo : '');
  const [telefone, setTelefone] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [listaDeProfissionais, setListaDeProfissionais] = useState([]);
  const [carregandoProfissionais, setCarregandoProfissionais] = useState(true);

  useEffect(function () {
    setCarregandoProfissionais(true);
    axios.get('http://localhost:8080/profissionais/todos')
      .then(function (response) {
        setListaDeProfissionais(response.data);
      })
      .catch(function () {
        alert('Erro ao carregar profissionais');
      })
      .finally(function () {
        setCarregandoProfissionais(false);
      });
  }, []);

  function handleAgendar() {
    var token = localStorage.getItem('token');
    if (!token) {
      alert('Paciente não autenticado. Faça login.');
      return;
    }

    var pacienteIdStr = localStorage.getItem('pacienteId');
    if (!pacienteIdStr) {
      alert('ID do paciente inválido ou não encontrado. Faça login novamente.');
      return;
    }
    var pacienteId = parseInt(pacienteIdStr, 10);
    if (isNaN(pacienteId)) {
      alert('ID do paciente inválido. Faça login novamente.');
      return;
    }

    var medicoSelecionado = listaDeProfissionais.find(function (p) { return p.nome === profissional; });
    if (!medicoSelecionado) {
      alert('Profissional não encontrado.');
      return;
    }

    var dataHora = data + 'T' + (horario.length === 5 ? horario + ':00' : horario);

    var dadosConsulta = {
      dataHora: dataHora,
      pacienteId: pacienteId,
      profissionalId: medicoSelecionado.id,
      especialidade: especialidade,
      observacoes: observacoes,
      telefonePaciente: telefone,
      nomePaciente: nome,
      procedimento: procedimento
    };

    axios.post('http://localhost:8080/consultas', dadosConsulta, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(function (res) {
        alert('Consulta agendada com sucesso');

        localStorage.setItem('pacienteNome', nome);

        var consultasAntigas = JSON.parse(localStorage.getItem('consultas')) || [];
        consultasAntigas.push({
          nome: nome,
          telefone: telefone,
          observacoes: observacoes,
          procedimento: procedimento,
          profissional: medicoSelecionado.nome,
          data: data + ' ' + horario,
          especialidade: medicoSelecionado.especialidade
        });
        localStorage.setItem('consultas', JSON.stringify(consultasAntigas));

        if (onConfirm) onConfirm(res.data);
        onClose();
      })
      .catch(function (error) {
        console.error('Erro ao agendar consulta:', error.response ? error.response.data : error.message);
        alert('Erro ao agendar consulta');
      });
  }

  return React.createElement('div', { className: 'modal-overlay' },
    React.createElement('div', { className: 'modal-content' },
      React.createElement('button', { className: 'btn-fechar', onClick: onClose }, '×'),

      React.createElement('h2', null, 'Agendar ' + procedimento),

      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Especialidade:'),
        React.createElement('select', {
          value: especialidade,
          onChange: function (e) { setEspecialidade(e.target.value); }
        },
          React.createElement('option', { value: '' }, 'Selecione'),
          React.createElement('option', { value: 'Preenchimento facial' }, 'Preenchimento facial'),
          React.createElement('option', { value: 'Botox' }, 'Botox'),
          React.createElement('option', { value: 'Laser' }, 'Laser'),
          React.createElement('option', { value: 'Harmonização Facial' }, 'Harmonização Facial'),
          React.createElement('option', { value: 'Limpeza de Pele' }, 'Limpeza de Pele'),
          React.createElement('option', { value: 'Microagulhamento' }, 'Microagulhamento')
        )
      ),

      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Profissional:'),
        React.createElement('select', {
          value: profissional,
          onChange: function (e) { setProfissional(e.target.value); },
          disabled: carregandoProfissionais
        },
          React.createElement('option', { value: '' }, carregandoProfissionais ? 'Carregando profissionais...' : 'Selecione'),
          listaDeProfissionais.map(function (p) {
            return React.createElement('option', { key: p.id, value: p.nome },
              p.nome + ' - ' + p.especialidade
            );
          })
        )
      ),

      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Seu Nome:'),
        React.createElement('input', {
          type: 'text',
          placeholder: 'Digite seu nome',
          value: nome,
          onChange: function (e) { setNome(e.target.value); }
        })
      ),

      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Telefone:'),
        React.createElement('input', {
          type: 'tel',
          placeholder: '(00) 00000-0000',
          value: telefone,
          onChange: function (e) { setTelefone(e.target.value); }
        })
      ),

      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Data da Consulta:'),
        React.createElement('input', {
          type: 'date',
          value: data,
          onChange: function (e) { setData(e.target.value); }
        })
      ),

      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Horário da Consulta:'),
        React.createElement('input', {
          type: 'time',
          value: horario,
          onChange: function (e) { setHorario(e.target.value); }
        })
      ),

      React.createElement('div', { className: 'form-group' },
        React.createElement('label', null, 'Observações:'),
        React.createElement('textarea', {
          placeholder: 'Ex: Quero que seja no período da manhã',
          value: observacoes,
          onChange: function (e) { setObservacoes(e.target.value); }
        })
      ),

      React.createElement('button', {
        className: 'btn-agendar',
        onClick: handleAgendar,
        disabled: !especialidade || !profissional || !nome || !telefone || !data || !horario || carregandoProfissionais
      }, carregandoProfissionais ? 'Carregando...' : 'Agendar')
    )
  );
}

export default ModalAgendar;
