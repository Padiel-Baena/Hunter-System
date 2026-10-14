import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./services/firebase";

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Escuchamos el estado de autenticación en tiempo real
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Pantalla de carga mientras Firebase comprueba si hay una sesión activa guardada
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-red-600 font-black tracking-widest uppercase text-sm">
        CARGANDO SISTEMA GRIMORIO...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de Login: si ya está logueado, lo mandamos al dashboard directamente */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />

        {/* Rutas protegidas: si no hay usuario, redirigen al login ("/") */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/grimorio"
          element={user ? <Grimorio /> : <Navigate to="/" replace />}
        />
        <Route
          path="/grimorio/:categoryId"
          element={user ? <CategoryView /> : <Navigate to="/" replace />}
        />

        {/* El Salón de Trofeos en su ruta propia */}
        <Route
          path="/salon"
          element={user ? <SalonTrofeos /> : <Navigate to="/" replace />}
        />

        {/* El Gremio como Terminal de Respaldo JSON */}
        <Route
          path="/gremio"
          element={user ? <Gremio /> : <Navigate to="/" replace />}
        />

        <Route
          path="/oraculo"
          element={user ? <Oraculo /> : <Navigate to="/" replace />}
        />

        <Route
          path="/sistema"
          element={user ? <Sistema /> : <Navigate to="/" replace />}
        />

        {/* Cualquier otra ruta desconocida redirige al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
