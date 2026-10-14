import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Book,
  ScrollText,
  Gamepad2,
  Film,
  Tv,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { getCollection } from "../services/db";
import { CollectionItem } from "../models/types";
import Layout from "../components/Layout";
import NewRecordModal from "../components/NewRecordModal";

export default function Grimorio() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    const data = await getCollection();
    setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // AQUÍ PUEDES DEFINIR UNA IMAGEN PARA ESCRITORIO (desktopImg) Y OTRA PARA MÓVIL (mobileImg):
  const categories = [
    {
      id: "libros",
      type: "BOOKS",
      title: "LIBROS",
      icon: Book,
      color:
        "border-p5-blood hover:shadow-[0_0_25px_rgba(230,0,18,0.4)] text-p5-blood",
      desktopImg: "/libros.png", // Imagen vertical para PC
      mobileImg: "/libros-mobile.jpeg", // Imagen horizontal/panorámica para Móvil
    },
    {
      id: "manga",
      type: "MANGA",
      title: "MANGAS",
      icon: ScrollText,
      color:
        "border-sl-cyan hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] text-sl-cyan",
      desktopImg: "/manga.png",
      mobileImg: "/manga-mobile.jpeg",
    },
    {
      id: "series",
      type: "SERIES",
      title: "SERIES",
      icon: Tv,
      color:
        "border-sl-purple hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] text-sl-purple",
      desktopImg: "/series.png",
      mobileImg: "/series-mobile.jpeg",
    },
    {
      id: "peliculas",
      type: "MOVIES",
      title: "PELÍCULAS",
      icon: Film,
      color:
        "border-p5-gold hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] text-p5-gold",
      desktopImg: "/peliculas.png",
      mobileImg: "/peliculas-mobile.jpg",
    },
    {
      id: "videojuegos",
      type: "GAMES",
      title: "VIDEOJUEGOS",
      icon: Gamepad2,
      color:
        "border-sl-cyan hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] text-sl-cyan",
      desktopImg: "/videojuegos.png",
      mobileImg: "/videojuegos-mobile.jpeg",
    },
  ];

  const getCategoryCount = (type: string) =>
    items.filter((i) => i.category === type).length;

  return (
    <Layout>
      <div className="p-4 md:p-8 flex-grow flex flex-col max-w-7xl mx-auto w-full animate-system-open origin-center relative">
        {/* Cabecera con Botón de Retorno al Inicio */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-neutral-800 pb-4 gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="bg-sl-surface border border-neutral-700 text-gray-300 hover:text-sl-cyan hover:border-sl-cyan px-3 py-2 text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 transform -skew-x-6 cursor-pointer"
            >
              <ArrowLeft size={14} className="skew-x-6" />{" "}
              <span className="skew-x-6">INICIO</span>
            </Link>
            <div>
              <p className="text-[10px] text-sl-cyan font-bold tracking-widest uppercase mb-1">
                Archivo Central del Sistema
              </p>
              <h2 className="text-3xl text-white font-black tracking-widest uppercase flex items-center gap-3">
                Grimorio
              </h2>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-sl-cyan border border-sl-cyan text-black font-bold text-xs py-2 px-6 -skew-x-6 hover:bg-transparent hover:text-sl-cyan hover:shadow-glow-cyan transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={14} className="skew-x-6" />
            <span className="skew-x-6 block tracking-widest">
              AÑADIR NUEVO OBJETO
            </span>
          </button>
        </div>

        {/* CONTENEDOR DE TARJETAS CON IMÁGENES ADAPTABLES SEGÚN PANTALLA */}
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-sl-cyan border-t-transparent rounded-full animate-spin shadow-glow-cyan"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pb-10">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count = getCategoryCount(cat.type);

              return (
                <Link
                  key={cat.id}
                  to={`/grimorio/${cat.id}`}
                  className={`group relative bg-sl-surface border-2 ${cat.color} p-6 flex flex-col justify-between transform -skew-x-3 hover:-skew-x-0 transition-all duration-300 cursor-pointer overflow-hidden h-[450px] shadow-xl`}
                >
                  {/* CAPA DE IMÁGENES DIFERENCIADAS POR TAMAÑO DE PANTALLA */}
                  <div className="absolute inset-0 z-0">
                    {/* Imagen para Escritorio (Oculta en móviles con 'hidden md:block') */}
                    {cat.desktopImg && (
                      <img
                        src={cat.desktopImg}
                        alt={cat.title}
                        className="hidden md:block w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                      />
                    )}

                    {/* Imagen para Móvil (Oculta en escritorio con 'block md:hidden') */}
                    {cat.mobileImg && (
                      <img
                        src={cat.mobileImg}
                        alt={cat.title}
                        className="block md:hidden w-full h-full object-cover object-center opacity-70 group-hover:opacity-90 transition-all duration-500"
                      />
                    )}

                    {/* Degradado general para asegurar visibilidad del texto */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/60"></div>
                  </div>

                  {/* CONTENIDO SUPERIOR: REGISTROS E ICONO */}
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="text-[9px] font-black tracking-widest uppercase px-2 py-1 bg-black/90 text-white border border-neutral-700 shadow-md">
                      REGISTROS: {count}
                    </span>
                    <Icon
                      size={22}
                      className="opacity-90 group-hover:scale-110 transition-all text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                    />
                  </div>

                  {/* TÍTULO CENTRAL */}
                  <div className="relative z-10 my-auto py-6 text-center">
                    <h3 className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase text-white group-hover:text-sl-cyan transition-colors drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                      {cat.title}
                    </h3>
                  </div>

                  {/* PIE DE TARJETA */}
                  <div className="relative z-10 pt-4 border-t border-white/20 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-gray-300 group-hover:text-white transition-colors">
                    <span>EXPLORAR</span>
                    <span>&gt;&gt;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <NewRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (newItem) => {
          const { saveItem } = await import("../services/db");
          await saveItem(newItem);
          await fetchItems();
        }}
      />
    </Layout>
  );
}
