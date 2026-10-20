import { Route, Routes } from "react-router-dom";
import Cabecalho from "./components/Cabecalho.jsx";
import ListaItens from "./pages/ListaItens.jsx";
import DetalhesItem from "./pages/DetalhesItem.jsx";
import FormularioItem from "./pages/FormularioItem.jsx";

export default function App() {
  return (
    <>
      <Cabecalho />
      <main className="container">
        <Routes>
          <Route path="/" element={<ListaItens />} />
          <Route path="/item/:id" element={<DetalhesItem />} />
          <Route path="/novo" element={<FormularioItem />} />
          <Route path="/editar/:id" element={<FormularioItem />} />
        </Routes>
      </main>
    </>
  );
}
