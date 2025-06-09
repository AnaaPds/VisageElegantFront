import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/VerConsultasPaciente.css";

function VerConsultasPaciente() {
  const [consultas, setConsultas] = useState([]);
  const [editId, setEditId] = useState(null);
  const [novaData, setNovaData] = useState('');
  const [filtroProcedimento, setFiltroProcedimento] = useState('');
  const [filtroProfissional, setFiltroProfissional] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const navigate = useNavigate();

  const API_BASE = "http://localhost:8080/consultas";

  useEffect(() => {
    const idPaciente = localStorage.getItem("pacienteId");
    const token = localStorage.getItem("token");

    if (!idPaciente) {
      alert("Paciente não autenticado. Faça login.");
      navigate("/login");
      return;
    }

    fetch(`${API_BASE}/paciente/${idPaciente}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao carregar consultas");
        return res.json();
      })
      .then(data => {
        setConsultas(data);
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao carregar consultas");
      });
  }, [navigate]);

  const cancelarConsulta = (id) => {
    fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (res.status === 204) {
          setConsultas(prev => prev.filter(c => c.id !== id));
        } else {
          alert("Erro ao cancelar consulta");
        }
      })
      .catch(() => alert("Erro ao cancelar consulta"));
  };

  const iniciarRemarcacao = (id) => {
    setEditId(id);
    const consulta = consultas.find(c => c.id === id);
    if (consulta) {
      const datetime = consulta.dataHora || consulta.dataConsulta || '';
      setNovaData(datetime.slice(0, 16));
    }
  };

  const confirmarRemarcacao = () => {
    if (!novaData.trim()) return;

    const consulta = consultas.find(c => c.id === editId);
    if (!consulta) return;

    const updatedConsulta = {
      ...consulta,
      dataHora: novaData, // <- CORREÇÃO: usar dataHora
    };

    fetch(`${API_BASE}/${editId}`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedConsulta),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao atualizar consulta");

        setConsultas(prev =>
          prev.map(c =>
            c.id === editId ? { ...c, dataHora: novaData } : c
          )
        );
        setEditId(null);
        setNovaData('');
      })
      .catch(err => alert(err.message));
  };

  function obterNomeProfissional(consulta) {
    if (consulta.nomeProfissional) return consulta.nomeProfissional;
    if (consulta.medico) return consulta.medico;
    if (consulta.nomeMedico) return consulta.nomeMedico;
    if (typeof consulta.profissional === "string") return consulta.profissional;
    if (consulta.profissional && typeof consulta.profissional === "object") {
      return consulta.profissional.nome || "Não informado";
    }
    return "Não informado";
  }

  const consultasFiltradas = consultas.filter((consulta) => {
    const procedimento = (
      consulta.especialidade ||
      consulta.procedimento ||
      ''
    ).toLowerCase();

    const profissional = obterNomeProfissional(consulta).toLowerCase();

    const dataConsulta = (consulta.dataHora || consulta.dataConsulta || '').split('T')[0];

    return (
      (filtroProcedimento === '' || procedimento.includes(filtroProcedimento.toLowerCase())) &&
      (filtroProfissional === '' || profissional.includes(filtroProfissional.toLowerCase())) &&
      (filtroData === '' || dataConsulta === filtroData)
    );
  });

  return React.createElement(
    "div",
    { className: "ver-consultas-container" },
    React.createElement("div", { className: "sidebar" },
      React.createElement("div", { className: "sidebar-icons" },
        React.createElement("img", {
          src: "assets/imagens/home.webp",
          alt: "home",
          style: { cursor: "pointer" },
          onClick: () => navigate("/home-paciente")
        }),
        React.createElement("img", {
          src: "assets/imagens/consultas.jpg",
          alt: "consultas"
        })
      )
    ),
    React.createElement("div", { className: "conteudo" },
      React.createElement("div", { className: "header" },
        React.createElement("h1", null, "Visage Élégant"),
        React.createElement("img", {
          src: "assets/imagens/hibisco.png",
          alt: "hibisco",
          className: "hibisco"
        })
      ),
      React.createElement("div", { className: "consultas" },
        React.createElement("h2", null, "Minhas Consultas"),
        React.createElement("div", { className: "filtros" },
          React.createElement("input", {
            type: "text",
            placeholder: "Filtrar por Procedimento",
            value: filtroProcedimento,
            onChange: (e) => setFiltroProcedimento(e.target.value)
          }),
          React.createElement("input", {
            type: "text",
            placeholder: "Filtrar por Profissional",
            value: filtroProfissional,
            onChange: (e) => setFiltroProfissional(e.target.value)
          }),
          React.createElement("input", {
            type: "date",
            value: filtroData,
            onChange: (e) => setFiltroData(e.target.value)
          })
        ),
        consultasFiltradas.length === 0
          ? React.createElement("div", { className: "sem-consultas" },
              React.createElement("p", null, "Nenhuma consulta encontrada.")
            )
          : React.createElement("div", { className: "consultas-lista" },
              consultasFiltradas.map((consulta) =>
                React.createElement("div", { className: "consulta-card", key: consulta.id },
                  React.createElement("div", { className: "consulta-info" },
                    React.createElement("h3", null, consulta.especialidade || consulta.procedimento || ""),
                    React.createElement("p", null, "Paciente: ", consulta.nomePaciente || consulta.nome || ""),
                    React.createElement("p", null, "Profissional: ", obterNomeProfissional(consulta)),
                    React.createElement("p", null,
                      "Data e Hora: ",
                      (consulta.dataHora || consulta.dataConsulta)
                        ? new Date(consulta.dataHora || consulta.dataConsulta).toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : "Não informado"
                    )
                  ),
                  React.createElement("div", { className: "consulta-botoes" },
                    editId === consulta.id
                      ? [
                          React.createElement("input", {
                            key: "input",
                            type: "datetime-local",
                            value: novaData,
                            onChange: (e) => setNovaData(e.target.value)
                          }),
                          React.createElement("button", {
                            key: "salvar",
                            onClick: confirmarRemarcacao
                          }, "Salvar"),
                          React.createElement("button", {
                            key: "cancelar",
                            onClick: () => setEditId(null)
                          }, "Cancelar")
                        ]
                      : [
                          React.createElement("button", {
                            key: "remarcar",
                            className: "btn-remarcar",
                            onClick: () => iniciarRemarcacao(consulta.id)
                          }, "Remarcar"),
                          React.createElement("button", {
                            key: "cancelar",
                            className: "btn-cancelar",
                            onClick: () => cancelarConsulta(consulta.id)
                          }, "Cancelar")
                        ]
                  )
                )
              )
            )
      )
    )
  );
}

export default VerConsultasPaciente;
