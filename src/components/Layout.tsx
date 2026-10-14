import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, Book, Swords, Settings, Home, Trophy } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { name: "INICIO", path: "/dashboard", icon: Home, color: "sl-cyan" },
    { name: "GRIMORIO", path: "/grimorio", icon: Book, color: "sl-cyan" },
    { name: "SALÓN", path: "/salon", icon: Trophy, color: "sl-purple" },
    { name: "GREMIO", path: "/gremio", icon: Swords, color: "sl-purple" },
    { name: "ORÁCULO", path: "/oraculo", icon: Activity, color: "yellow-500" },
    { name: "SISTEMA", path: "/sistema", icon: Settings, color: "p5-blood" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-sl-abyss text-p5-paper font-system selection:bg-p5-blood selection:text-white">
      {/* NAVEGACIÓN ESCRITORIO (Oculta en móvil) */}
      <nav className="hidden md:flex w-64 border-r border-sl-cyan/20 bg-sl-surface/50 backdrop-blur-sm z-20 flex-col justify-between">
        <div className="p-6">
          <h1 className="text-xl flex items-center justify-center text-sl-cyan uppercase tracking-[0.2em] font-black drop-shadow-[0_0_10px_rgba(0,229,255,0.8)] text-center">
            Hunter's
            <br />
            Log
          </h1>
        </div>
        <div className="flex flex-col p-4 gap-2 flex-grow">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative border py-3 px-4 flex items-center gap-3 transition-all cursor-pointer ${isActive ? `border-${item.color} bg-${item.color}/10 shadow-glow-cyan` : `border-${item.color}/30 bg-sl-surface hover:border-${item.color}`}`}
              >
                <div
                  className={`absolute inset-0 bg-${item.color} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0`}
                ></div>
                <item.icon
                  size={18}
                  className={`relative z-10 ${isActive ? `text-${item.color}` : "text-gray-400 group-hover:text-black"}`}
                />
                <span
                  className={`relative z-10 text-xs font-bold tracking-wider ${isActive ? `text-${item.color}` : "text-gray-400 group-hover:text-black"} transition-colors`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL (Con padding inferior en móvil para que no lo tape la barra) */}
      <main className="flex-grow flex flex-col h-screen overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* NAVEGACIÓN MÓVIL (Barra inferior fija) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full border-t border-sl-cyan/30 bg-sl-surface/95 backdrop-blur-md z-50 flex justify-around items-center p-2 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center p-1 w-14 relative"
            >
              <item.icon
                size={18}
                className={`${isActive ? `text-${item.color}` : "text-gray-500"} mb-1`}
              />
              <span
                className={`text-[7px] font-bold tracking-widest ${isActive ? `text-${item.color}` : "text-gray-500"}`}
              >
                {item.name}
              </span>
              {isActive && (
                <div
                  className={`absolute -top-1 w-6 h-0.5 bg-${item.color} shadow-glow-cyan`}
                ></div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
