import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import "./Cabecalho.css";

export default function Cabecalho() {
  const [nome, setNome] = useState("");

  useEffect(() => {
    async function buscarAluno() {
      try {
        const resposta = await api.get("/eu");
        setNome(resposta.data.nome || resposta.data.name || "Aluno");
      } catch (erro) {
        setNome("Aluno");
      }
    }

    buscarAluno();
  }, []);

  return (
    <header className="cabecalho">
      <div className="cabecalho__conteudo">
        <Link to="/" className="cabecalho__titulo">Achados e Perdidos IFRN</Link>
        <span>Olá, {nome}</span>
      </div>
    </header>
  );
}
