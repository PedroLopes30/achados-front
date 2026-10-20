import "./ItemFiltros.css";

function valorOpcao(opcao) {
  if (typeof opcao === "string") return opcao;
  return opcao.nome || opcao.name || opcao.categoria || opcao.local || "";
}

export default function ItemFiltros({ filtros, categorias, locais, onChange, onFiltrar, onLimpar }) {
  return (
    <form className="filtros" onSubmit={onFiltrar}>
      <label className="filtros__busca">
        Buscar por nome ou descrição
        <input
          type="text"
          value={filtros.busca}
          onChange={(evento) => onChange("busca", evento.target.value)}
          placeholder="Ex.: garrafa azul"
        />
      </label>

      <label>
        Status
        <select value={filtros.status} onChange={(evento) => onChange("status", evento.target.value)}>
          <option value="">Todos</option>
          <option value="aguardando">Aguardando</option>
          <option value="devolvido">Devolvido</option>
        </select>
      </label>

      <label>
        Categoria
        <select value={filtros.categoria} onChange={(evento) => onChange("categoria", evento.target.value)}>
          <option value="">Todas</option>
          {categorias.map((opcao) => {
            const valor = valorOpcao(opcao);
            return <option key={valor} value={valor}>{valor}</option>;
          })}
        </select>
      </label>

      <label>
        Local
        <select value={filtros.local} onChange={(evento) => onChange("local", evento.target.value)}>
          <option value="">Todos</option>
          {locais.map((opcao) => {
            const valor = valorOpcao(opcao);
            return <option key={valor} value={valor}>{valor}</option>;
          })}
        </select>
      </label>

      <div className="filtros__botoes">
        <button className="botao" type="submit">Filtrar</button>
        <button className="botao botao--secundario" type="button" onClick={onLimpar}>Limpar</button>
      </div>
    </form>
  );
}
