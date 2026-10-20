import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api.js";
import ItemFormulario from "../components/ItemFormulario.jsx";
import "./FormularioItem.css";

const valoresVazios = {
  nome: "",
  descricao: "",
  categoria: "",
  local: "",
  data_encontrado: ""
};

function pegarLista(dados, chave) {
  if (Array.isArray(dados)) return dados;
  return dados?.[chave] || [];
}

export default function FormularioItem() {
  const { id } = useParams();
  const editando = Boolean(id);
  const [valores, setValores] = useState(valoresVazios);
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    async function carregarFormulario() {
      try {
        const respostaCategorias = await api.get("/categorias");
        setCategorias(pegarLista(respostaCategorias.data, "categorias"));
      } catch (erroApi) {
        setErro(erroApi.response?.data?.detail || "Não foi possível carregar as categorias.");
      }

      try {
        const respostaLocais = await api.get("/locais");
        setLocais(pegarLista(respostaLocais.data, "locais"));
      } catch (erroApi) {
        setErro(erroApi.response?.data?.detail || "Não foi possível carregar os locais.");
      }

      if (editando) {
        try {
          const resposta = await api.get(`/itens/${id}`);
          const item = resposta.data.item || resposta.data;
          setValores({
            nome: item.nome || "",
            descricao: item.descricao || "",
            categoria: item.categoria || "",
            local: item.local || "",
            data_encontrado: item.data_encontrado || ""
          });
        } catch (erroApi) {
          setErro(erroApi.response?.data?.detail || "Não foi possível carregar esse item.");
        }
      }
    }

    carregarFormulario();
  }, [editando, id]);

  async function salvar(evento) {
    evento.preventDefault();
    setCarregando(true);
    setErro("");
    setMensagem("");

    try {
      if (editando) {
        await api.put(`/itens/${id}`, valores);
        setMensagem("Item atualizado com sucesso.");
      } else {
        await api.post("/itens", valores);
        setMensagem("Item cadastrado com sucesso.");
      }
    } catch (erroApi) {
      setErro(erroApi.response?.data?.detail || "Não foi possível salvar. Confira os dados e tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  if (mensagem) {
    return (
      <section className="formulario-pagina">
        <h1>{editando ? "Item atualizado" : "Item cadastrado"}</h1>
        <p className="mensagem mensagem--sucesso">{mensagem}</p>
        <Link className="botao" to={editando ? `/item/${id}` : "/"}>
          {editando ? "Ver detalhes do item" : "Voltar para a lista"}
        </Link>
      </section>
    );
  }

  return (
    <section className="formulario-pagina">
      <Link to={editando ? `/item/${id}` : "/"} className="voltar">← Voltar</Link>
      <h1>{editando ? "Editar item" : "Cadastrar item"}</h1>
      <p className="formulario-pagina__descricao">
        {editando ? "Altere as informações e salve." : "Preencha os dados do objeto encontrado."}
      </p>
      <ItemFormulario
        valores={valores}
        categorias={categorias}
        locais={locais}
        onChange={setValores}
        onSubmit={salvar}
        linkCancelar={editando ? `/item/${id}` : "/"}
        carregando={carregando}
        editando={editando}
        erro={erro}
      />
    </section>
  );
}
