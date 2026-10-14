import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Sparkles,
  Shuffle,
  Book,
  ScrollText,
  Gamepad2,
  Film,
  Tv,
  ArrowLeft,
} from "lucide-react";
import { getCollection } from "../services/db";
import { CollectionItem, ItemCategory } from "../models/types";
import Layout from "../components/Layout";

type OracleMode = "WISHLIST" | "PENDING" | "COMPLETED";

export default function Oraculo() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<
    ItemCategory | "ALL"
  >("ALL");
  const [selectedMode, setSelectedMode] = useState<OracleMode>("PENDING");

  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data = await getCollection();
      setItems(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const consultOracle = () => {
    let pool = items.filter((i) => {
      if (selectedMode === "WISHLIST") return i.status === "WISHLIST";
      if (selectedMode === "PENDING") return i.status === "PENDING";
      if (selectedMode === "COMPLETED") return i.status === "COMPLETED";
      return false;
    });

    if (selectedCategory !== "ALL") {
      pool = pool.filter((i) => i.category === selectedCategory);
    }

    if (pool.length === 0) {
      setSelectedItem(null);
      alert(
        "El Oráculo no encuentra registros que cumplan con los parámetros seleccionados.",
      );
      return;
    }

    // Si hay más de un elemento, filtramos el actual para evitar repetición inmediata
    if (selectedItem && pool.length > 1) {
      pool = pool.filter((i) => i.id !== selectedItem.id);
    }

    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setSelectedItem(pool[randomIndex]);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 70);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BOOKS":
        return <Book size={18} />;
      case "MANGA":
        return <ScrollText size={18} />;
      case "GAMES":
        return <Gamepad2 size={18} />;
      case "MOVIES":
        return <Film size={18} />;
      case "SERIES":
        return <Tv size={18} />;
      default:
        return <Activity size={18} />;
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 flex-grow flex flex-col max-w-5xl mx-auto w-full animate-system-open origin-center relative pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-yellow-500/30 pb-4 gap-4">
          <div className="flex flex-col gap-4">
            <Link
              to="/dashboard"
              className="bg-sl-surface border border-neutral-700 text-gray-300 hover:text-yellow-500 hover:border-yellow-500 px-3 py-2 text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 transform -skew-x-6 cursor-pointer w-fit"
            >
              <ArrowLeft size={14} className="skew-x-6" />{" "}
              <span className="skew-x-6">INICIO</span>
            </Link>

            <div>
              <p className="text-[10px] text-yellow-500 font-bold tracking-widest uppercase mb-1">
                Módulo de Decisión Cuántica
              </p>
              <h2 className="text-3xl text-white font-black tracking-widest uppercase flex items-center gap-3">
                <Activity className="text-yellow-500" size={32} />
                Oráculo del Destino
              </h2>
              <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
                Deja que el sistema decida tu próxima obra a consumir
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-sl-surface/80 border border-yellow-500/30 p-6 relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-yellow-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-yellow-500"></div>

          <div className="flex flex-col">
            <label className="text-[10px] text-yellow-500 font-bold tracking-widest uppercase mb-2">
              1. Seleccionar Modo de Destino
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "PENDING", label: "Modo Consumo" },
                { id: "WISHLIST", label: "Modo Compra" },
                { id: "COMPLETED", label: "Reexploración" },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id as OracleMode)}
                  className={`py-2 px-2 text-[9px] font-black uppercase border tracking-wider transition-all cursor-pointer text-center
                    ${selectedMode === mode.id ? "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]" : "bg-black/50 text-gray-400 border-neutral-700 hover:border-yellow-500/50"}
                  `}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] text-yellow-500 font-bold tracking-widest uppercase mb-2">
              2. Filtrar por Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-black/50 border border-yellow-500/40 text-white p-2.5 text-xs outline-none focus:border-yellow-500 cursor-pointer font-bold uppercase"
            >
              <option value="ALL">Todas las Categorías (Global)</option>
              <option value="BOOKS">Libros</option>
              <option value="MANGA">Mangas</option>
              <option value="GAMES">Videojuegos</option>
              <option value="MOVIES">Películas</option>
              <option value="SERIES">Series</option>
            </select>
          </div>
        </div>

        <button
          onClick={consultOracle}
          disabled={isLoading || items.length === 0}
          className="w-full bg-yellow-500 border border-yellow-500 text-black font-black text-sm py-4 -skew-x-2 hover:bg-transparent hover:text-yellow-500 transition-colors group relative overflow-hidden cursor-pointer shadow-[0_0_15px_rgba(234,179,8,0.4)] disabled:opacity-50 mb-8"
        >
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
          <span className="skew-x-2 block relative z-10 tracking-[0.2em] flex items-center justify-center gap-2">
            <Sparkles size={18} /> CONSULTAR AL ORÁCULO DEL DESTINO
          </span>
        </button>

        {selectedItem && (
          <div
            className={`bg-sl-surface border-2 ${isSpinning ? "border-yellow-500 animate-pulse" : "border-yellow-500 shadow-[0_0_25px_rgba(234,179,8,0.4)]"} p-6 relative flex flex-col md:flex-row items-center gap-6 animate-system-open`}
          >
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-500"></div>

            <div className="w-32 h-44 border border-neutral-700 bg-neutral-900 overflow-hidden relative flex-shrink-0 shadow-md">
              {selectedItem.coverImage ? (
                <img
                  src={selectedItem.coverImage}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px] font-bold uppercase">
                  Sin Portada
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center flex-grow text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-[9px] font-black px-2 py-0.5 border border-yellow-500 bg-yellow-500/10 text-yellow-500 uppercase tracking-widest flex items-center gap-1">
                  {getCategoryIcon(selectedItem.category)}{" "}
                  {selectedItem.category}
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 border border-neutral-700 bg-black text-gray-400 uppercase tracking-widest">
                  {selectedItem.status}
                </span>
              </div>

              <h3 className="text-2xl text-white font-black tracking-wide uppercase mb-3">
                {selectedItem.title}
              </h3>

              <p className="text-xs text-gray-400 mb-4">
                {isSpinning
                  ? "Sintonizando frecuencias del destino..."
                  : "El Oráculo ha seleccionado este registro. Tu camino está sellado."}
              </p>

              {!isSpinning && (
                <div className="flex gap-3 justify-center md:justify-start">
                  <button
                    onClick={consultOracle}
                    className="bg-black border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black py-2 px-4 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Shuffle size={14} /> TIRAR DE NUEVO
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
