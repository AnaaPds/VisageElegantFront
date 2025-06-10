import React, { useState } from 'react';
import '../styles/CadastroProfissional.css';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CadastroProfissional() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (!nome || !especialidade || !telefone || !email || !senha) {
      alert('Preencha todos os campos!');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Digite um email válido');
      return;
    }

    if (senha.length < 6) {
      alert('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await api.post('/profissionais/cadastrar', {
        nome,
        especialidade,
        telefone,
        email,
        senha,
      });

      alert('Cadastro realizado com sucesso!');
      navigate('/login-profissional');
    } catch (error) {
      console.error('Erro no cadastro:', error);

      if (error.response && error.response.status === 409) {
        alert('Email já cadastrado!');
      } else {
        alert('Erro ao cadastrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-profissional-container">
      <div className="header">
        <h1>Visage Élégant</h1>
        <img src="/assets/imagens/hibisco.png" alt="Logo Hibisco" className="logo-hibisco" />
      </div>

      <div className="cadastro-card">
        <h2>Cadastro Profissional</h2>
        <form onSubmit={handleCadastro}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <select
            value={especialidade}
            onChange={(e) => setEspecialidade(e.target.value)}
            required
          >
            <option value="">Selecione a Especialidade</option>
            <option value="Cirurgia Plástica">Cirurgia Plástica</option>
            <option value="Dermatologia">Dermatologia</option>
            <option value="Medicina Estética">Medicina Estética</option>
          </select>
          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p className="link-login">
          Já tem cadastro?{' '}
          <span onClick={() => navigate('/login-profissional')} style={{ cursor: 'pointer', color: 'blue' }}>
            Faça login
          </span>
        </p>
      </div>
    </div>
  );
}

export default CadastroProfissional;
