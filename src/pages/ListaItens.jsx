import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import ItemCard from "../components/ItemCard.jsx";
import ItemFiltros from "../components/ItemFiltros.jsx";
import "./ListaItens.css";

const filtrosVazios = { busca: "", status: "", categoria: "", local: "" };

function pegarLista(dados, chave) {
  if (Array.isArray(dados)) return dados;
  return dados?.[chave] || [];
}

export default function ListaItens() {
  const [itens, setItens] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [filtros, setFiltros] = useState(filtrosVazios);
  const [filtrosAplicados, setFiltrosAplicados] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarItens() {
      setCarregando(true);
      setErro("");

      try {
        const resposta = await api.get("/itens", { params: filtrosAplicados });
        setItens(pegarLista(resposta.data, "itens"));
      } catch (erroApi) {
        setErro(erroApi.response?.data?.detail || "Não foi possível carregar os itens. Confira sua chave da API.");
      } finally {
        setCarregando(false);
      }
    }

    carregarItens();
  }, [filtrosAplicados]);

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const respostaCategorias = await api.get("/categorias");
        setCategorias(pegarLista(respostaCategorias.data, "categorias"));
      } catch (erroApi) {
        console.error("Não foi possível carregar as categorias:", erroApi);
      }

      try {
        const respostaLocais = await api.get("/locais");
        setLocais(pegarLista(respostaLocais.data, "locais"));
      } catch (erroApi) {
        console.error("Não foi possível carregar os locais:", erroApi);
      }
    }

    carregarOpcoes();
  }, []);


  function mudarFiltro(nome, valor) {
    setFiltros({ ...filtros, [nome]: valor });
  }

  function filtrar(evento) {
    evento.preventDefault();
    const novosFiltros = {};
    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor.trim()) novosFiltros[chave] = valor.trim();
    });
    setFiltrosAplicados(novosFiltros);
  }

  function limparFiltros() {
    setFiltros(filtrosVazios);
    setFiltrosAplicados({});
  }

  return (
    <section className="lista-pagina">
      <div className="lista-pagina__titulo">
        <div>
          <h1>Itens encontrados</h1>
          <p>Consulte os objetos encontrados no campus.</p>
        </div>
        <Link to="/novo" className="botao">+ Novo item</Link>
      </div>

      {erro && <p className="mensagem mensagem--erro">{erro}</p>}

      <ItemFiltros
        filtros={filtros}
        categorias={categorias}
        locais={locais}
        onChange={mudarFiltro}
        onFiltrar={filtrar}
        onLimpar={limparFiltros}
      />

      {carregando ? (
        <p>Carregando itens...</p>
      ) : erro ? null : itens.length === 0 ? (
        <p className="lista-pagina__vazia">Nenhum item encontrado.</p>
      ) : (
        <div className="lista-pagina__itens">
          {itens.map((item) => <ItemCard key={item.id} item={item} />)}
        </div>
      )}
    </section>
  );
}
