import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Star,
  CheckCircle2,
  Award,
  Film,
  Book,
  ScrollText,
  Gamepad2,
  Tv,
  ArrowLeft,
} from "lucide-react";
import { getCollection, saveItem } from "../services/db";
import { CollectionItem } from "../models/types";
import Layout from "../components/Layout";
import ItemDetailModal from "../components/ItemDetailModal";

export default function SalonTrofeos() {
  const [completedItems, setCompletedItems] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);

  const fetchCompletedData = async () => {
    setIsLoading(true);
    const allItems = await getCollection();
    // Filtramos exclusivamente los completados
    const completed = allItems.filter((item) => item.status === "COMPLETED");
    setCompletedItems(completed);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCompletedData();
  }, []);

  const handleUpdateStatus = async (item: CollectionItem, newStatus: any) => {
    const updated = { ...item, status: newStatus };
    await saveItem(updated);
    setSelectedItem(null);
    await fetchCompletedData(); // Si deja de estar completado, se actualiza el salón
  };

  // Estadísticas del Salón
  const totalCompleted = completedItems.length;
  const ratedItems = completedItems.filter((i) => i.rating && i.rating > 0);
  const averageRating =
    ratedItems.length > 0
      ? (
          ratedItems.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          ratedItems.length
        ).toFixed(1)
      : "N/A";

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "BOOKS":
        return <Book size={14} />;
      case "MANGA":
        return <ScrollText size={14} />;
      case "GAMES":
        return <Gamepad2 size={14} />;
      case "MOVIES":
        return <Film size={14} />;
      case "SERIES":
        return <Tv size={14} />;
      default:
        return <Trophy size={14} />;
    }
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 flex-grow flex flex-col max-w-7xl mx-auto w-full animate-system-open origin-center relative">
        {/* Cabecera del Salón */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-sl-purple/30 pb-4 gap-4">
          <div className="flex flex-col gap-4">
            <Link
              to="/dashboard"
              className="bg-sl-surface border border-neutral-700 text-gray-300 hover:text-sl-purple hover:border-sl-purple px-3 py-2 text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 transform -skew-x-6 cursor-pointer w-fit"
            >
              <ArrowLeft size={14} className="skew-x-6" />{" "}
              <span className="skew-x-6">INICIO</span>
            </Link>

            <div>
              <p className="text-[10px] text-sl-purple font-bold tracking-widest uppercase mb-1">
                Muro de Honor del Cazador
              </p>
              <h2 className="text-3xl text-white font-black tracking-widest uppercase flex items-center gap-3">
                <Trophy className="text-sl-purple" size={32} />
                Salón de Trofeos
              </h2>
              <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
                Registro permanente de obras conquistadas y purgadas
              </p>
            </div>
          </div>

          {/* Tarjetas de Estadísticas rápidas */}
          <div className="flex gap-4">
            <div className="bg-sl-surface border border-sl-purple/40 px-4 py-2 text-center shadow-md">
              <span className="text-[9px] text-gray-400 block uppercase tracking-widest">
                Conquistados
              </span>
              <span className="text-xl text-sl-purple font-black">
                {totalCompleted}
              </span>
            </div>
            <div className="bg-sl-surface border border-p5-gold/40 px-4 py-2 text-center shadow-md">
              <span className="text-[9px] text-gray-400 block uppercase tracking-widest">
                Nota Media
              </span>
              <span className="text-xl text-p5-gold font-black">
                {averageRating}
              </span>
            </div>
          </div>
        </div>

        {/* Contenido / Cuadrícula de Trofeos */}
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-sl-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : completedItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 bg-sl-surface/30 p-8 text-center mt-4">
            <div className="text-sl-purple/40 mb-4">
              <Award size={64} />
            </div>
            <h3 className="text-sm text-gray-300 font-bold tracking-widest uppercase mb-2">
              Salón Vacío
            </h3>
            <p className="text-xs text-gray-500 max-w-md">
              Todavía no hay trofeos registrados. Marca tus obras como{" "}
              <span className="text-sl-cyan font-bold">Completadas</span> en el
              Grimorio para que asciendan automáticamente a este muro.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-10">
            {completedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`bg-sl-surface/80 border ${item.isSpecialEdition ? "border-p5-gold shadow-[0_0_12px_rgba(251,191,36,0.3)]" : "border-sl-purple/40"} p-3 hover:border-sl-purple transition-colors group relative overflow-hidden flex flex-col aspect-[2/3] cursor-pointer`}
              >
                {/* Portada */}
                {item.coverImage ? (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-95 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-neutral-900/60 -z-10"></div>
                )}

                {item.isSpecialEdition && (
                  <div className="absolute top-0 right-0 bg-p5-gold text-black px-1.5 py-1 z-10 shadow-md">
                    <Star size={12} className="fill-black" />
                  </div>
                )}

                <div className="flex justify-between items-center mb-auto pt-1 z-10">
                  <span className="text-[8px] font-black tracking-wider px-2 py-0.5 border border-sl-cyan bg-black/80 text-sl-cyan flex items-center gap-1">
                    <CheckCircle2 size={10} /> COMPLETADO
                  </span>
                  <span className="text-sl-purple bg-black/60 p-1 border border-sl-purple/30">
                    {getCategoryIcon(item.category)}
                  </span>
                </div>

                <div className="mt-auto bg-black/85 p-2 border-t border-neutral-800 backdrop-blur-sm -mx-3 -mb-3 z-10">
                  <h4 className="text-white font-bold text-xs tracking-wide line-clamp-2 group-hover:text-sl-purple transition-colors">
                    {item.title}
                  </h4>

                  <div className="mt-1 flex justify-between items-center text-[9px] text-gray-400 uppercase tracking-widest">
                    <span>{item.category}</span>
                    {item.rating && (
                      <span className="text-p5-gold font-bold flex items-center gap-0.5">
                        <Star size={9} className="fill-p5-gold" /> {item.rating}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={() => {}}
        onDelete={async (id) => {
          const { deleteItem } = await import("../services/db");
          await deleteItem(id);
          setSelectedItem(null);
          await fetchCompletedData();
        }}
        onUpdateStatus={handleUpdateStatus}
      />
    </Layout>
  );
}
