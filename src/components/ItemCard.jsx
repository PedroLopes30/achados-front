import { Link } from "react-router-dom";
import "./ItemCard.css";

export default function ItemCard({ item }) {
  const devolvido = item.status === "devolvido";

  return (
    <article className="item-card">
      <div className="item-card__topo">
        <h2>{item.nome}</h2>
        <span className={devolvido ? "status status--devolvido" : "status status--aguardando"}>
          {item.status || "aguardando"}
        </span>
      </div>
      <p>{item.descricao || "Sem descrição."}</p>
      <div className="item-card__informacoes">
        <span><strong>Categoria:</strong> {item.categoria}</span>
        <span><strong>Local:</strong> {item.local}</span>
        <span><strong>Encontrado em:</strong> {item.data_encontrado}</span>
      </div>
      <Link className="botao botao--secundario" to={`/item/${item.id}`}>Ver detalhes</Link>
    </article>
  );
}
