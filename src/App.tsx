import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Grimorio from "./pages/Grimorio";
import CategoryView from "./pages/CategoryView";
import SalonTrofeos from "./pages/SalonTrofeos";
import Oraculo from "./pages/Oraculo";
import Gremio from "./pages/Gremio";
import Sistema from "./pages/Sistema";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route path="/grimorio" element={<Grimorio />} />
        <Route path="/grimorio/:categoryId" element={<CategoryView />} />

        {/* El Salón de Trofeos en su ruta propia */}
        <Route path="/salon" element={<SalonTrofeos />} />

        {/* El Gremio como Terminal de Respaldo JSON */}
        <Route path="/gremio" element={<Gremio />} />

        <Route path="/oraculo" element={<Oraculo />} />

        <Route path="/sistema" element={<Sistema />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
