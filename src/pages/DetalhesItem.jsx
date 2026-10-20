import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";
import "./DetalhesItem.css";

export default function DetalhesItem() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [excluido, setExcluido] = useState(false);

  useEffect(() => {
    async function carregarItem() {
      setCarregando(true);
      setErro("");
      try {
        const resposta = await api.get(`/itens/${id}`);
        setItem(resposta.data.item || resposta.data);
      } catch (erroApi) {
        setErro(erroApi.response?.data?.detail || "Não foi possível carregar esse item.");
      } finally {
        setCarregando(false);
      }
    }

    carregarItem();
  }, [id]);

  async function devolver(evento) {
    evento.preventDefault();
    if (!destinatario.trim()) {
      setErro("Informe o nome de quem recebeu o item.");
      return;
    }

    try {
      await api.patch(`/itens/${id}/devolver`, { devolvido_para: destinatario.trim() });
      setMensagem("Item marcado como devolvido.");
      setErro("");
      const resposta = await api.get(`/itens/${id}`);
      setItem(resposta.data.item || resposta.data);
      setDestinatario("");
    } catch (erroApi) {
      setErro(erroApi.response?.data?.detail || "Não foi possível registrar a devolução.");
    }
  }

  async function excluir() {
    const confirmou = window.confirm("Tem certeza que deseja excluir este item?");
    if (!confirmou) return;

    try {
      await api.delete(`/itens/${id}`);
      setMensagem("Item excluído com sucesso.");
      setExcluido(true);
    } catch (erroApi) {
      setErro(erroApi.response?.data?.detail || "Não foi possível excluir o item.");
    }
  }

  if (excluido) {
    return (
      <section className="detalhes-pagina">
        <h1>Item excluído</h1>
        <p className="mensagem mensagem--sucesso">{mensagem}</p>
        <Link className="botao" to="/">Voltar para a lista</Link>
      </section>
    );
  }

  if (carregando) return <p className="detalhes-pagina">Carregando item...</p>;
  if (erro && !item) return <p className="detalhes-pagina mensagem mensagem--erro">{erro}</p>;
  if (!item) return null;

  const devolvido = item.status === "devolvido";

  return (
    <section className="detalhes-pagina">
      <Link to="/" className="voltar">← Voltar para a lista</Link>
      <div className="detalhes-pagina__topo">
        <h1>{item.nome}</h1>
        <span className={devolvido ? "status status--devolvido" : "status status--aguardando"}>{item.status || "aguardando"}</span>
      </div>

      {mensagem && <p className="mensagem mensagem--sucesso">{mensagem}</p>}
      {erro && <p className="mensagem mensagem--erro">{erro}</p>}

      <div className="detalhes-pagina__dados">
        <p><strong>Descrição:</strong><br />{item.descricao || "Sem descrição."}</p>
        <p><strong>Categoria:</strong><br />{item.categoria}</p>
        <p><strong>Local:</strong><br />{item.local}</p>
        <p><strong>Encontrado em:</strong><br />{item.data_encontrado}</p>
        <p><strong>Devolvido para:</strong><br />{item.devolvido_para || "Ainda não devolvido"}</p>
        {item.data_devolucao && <p><strong>Data da devolução:</strong><br />{item.data_devolucao}</p>}
      </div>

      <div className="detalhes-pagina__botoes">
        <Link className="botao" to={`/editar/${id}`}>Editar</Link>
        <button className="botao botao--perigo" type="button" onClick={excluir}>Excluir</button>
      </div>

      {!devolvido && (
        <form className="devolucao-form" onSubmit={devolver}>
          <h2>Marcar como devolvido</h2>
          <label>
            Nome de quem recebeu
            <input value={destinatario} onChange={(evento) => setDestinatario(evento.target.value)} required />
          </label>
          <button className="botao" type="submit">Confirmar devolução</button>
        </form>
      )}
    </section>
  );
}
