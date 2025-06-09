import React, { useState } from 'react';
import '../styles/CadastroPaciente.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CadastroPaciente() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8080/pacientes/cadastrar', {

      nome,
      dataNasc,
      telefone,
      email,
      senha,
    })
      .then(response => {
        alert('Cadastro realizado com sucesso!');
        navigate('/login-paciente');
      })
      .catch(error => {
        console.error('Erro no cadastro:', error);
        alert('Erro ao cadastrar. Tente novamente.');
      });
  };

  return (
    <div className="cadastro-paciente-container">
      <div className="header">
        <h1>Visage Élégant</h1>
        <img src="/assets/imagens/hibisco.png" alt="Logo Hibisco" className="logo-hibisco" />
      </div>

      <div className="cadastro-card">
        <h2>Cadastro Paciente</h2>
        <form onSubmit={handleCadastro}>
          <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          <input type="date" placeholder="Data de Nascimento" value={dataNasc} onChange={(e) => setDataNasc(e.target.value)} required />
          <input type="text" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          <button type="submit">Cadastrar</button>
        </form>

        <p className="link-login">
          Já tem cadastro? <span onClick={() => navigate('/login-paciente')}>Faça login</span>
        </p>
      </div>
    </div>
  );
}

export default CadastroPaciente;
