import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastProvider.jsx";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Mensajes from "./pages/Mensajes";
import Usuarios from "./pages/Usuarios";
import Cuenta from "./pages/Cuenta";
import MisSolicitudes from "./pages/MisSolicitudes";

import "./styles/global.css";
import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/components.css";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/:usuarioId" element={<Perfil />} />
          <Route path="/mensajes" element={<Mensajes />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/cuenta" element={<Cuenta />} />
          <Route path="/solicitudes" element={<MisSolicitudes />} />
          <Route path="*" element={<Inicio />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
