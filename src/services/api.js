
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const loginPaciente = async (email, senha) => {
  try {
    const response = await api.post('/pacientes/login', { email, senha });
    const { token, paciente } = response.data;

    if (!token || !paciente?.id) {
      throw new Error('Token ou ID ausente no retorno do login');
    }

    localStorage.setItem('token', token);
    localStorage.setItem('pacienteId', paciente.id);
    localStorage.setItem('pacienteNome', paciente.nome);
    localStorage.setItem('emailPaciente', email);

    return paciente;
  } catch (error) {
    throw error;
  }
};

// Interceptor para enviar token em todas as requisições depois do login
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
