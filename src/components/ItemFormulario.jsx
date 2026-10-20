import { Link } from "react-router-dom";
import "./ItemFormulario.css";

export default function ItemFormulario({ valores, categorias, locais, onChange, onSubmit, carregando, editando, erro, linkCancelar }) {
  function campo(nome, valor) {
    onChange({ ...valores, [nome]: valor });
  }

  return (
    <form className="form-item" onSubmit={onSubmit}>
      {erro && <p className="mensagem mensagem--erro">{erro}</p>}

      <label>
        Nome do item
        <input required value={valores.nome} onChange={(evento) => campo("nome", evento.target.value)} />
      </label>

      <label>
        Descrição
        <textarea required rows="4" value={valores.descricao} onChange={(evento) => campo("descricao", evento.target.value)} />
      </label>

      <label>
        Categoria
        <select required value={valores.categoria} onChange={(evento) => campo("categoria", evento.target.value)}>
          <option value="">Selecione uma categoria</option>
          {categorias.map((categoria) => {
            const nome = typeof categoria === "string" ? categoria : categoria.nome || categoria.name;
            return <option key={nome} value={nome}>{nome}</option>;
          })}
        </select>
      </label>

      <label>
        Local onde foi encontrado
        <select required value={valores.local} onChange={(evento) => campo("local", evento.target.value)}>
          <option value="">Selecione um local</option>
          {locais.map((local) => {
            const nome = typeof local === "string" ? local : local.nome || local.name;
            return <option key={nome} value={nome}>{nome}</option>;
          })}
        </select>
      </label>

      <label>
        Data em que foi encontrado
        <input
          type="date"
          required
          value={valores.data_encontrado}
          onChange={(evento) => campo("data_encontrado", evento.target.value)}
        />
      </label>

      <div className="form-item__botoes">
        <button className="botao" type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Salvar"}
        </button>
        <Link className="botao botao--secundario" to={linkCancelar}>Cancelar</Link>
      </div>
      {editando && <p className="form-item__nota">Você está editando um item que já foi cadastrado.</p>}
    </form>
  );
}
