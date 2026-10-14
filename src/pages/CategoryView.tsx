import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Book,
  ScrollText,
  Gamepad2,
  Film,
  Tv,
  Star,
  Plus,
  BookOpen,
  Search,
} from "lucide-react";
import { getCollection, saveItem, deleteItem } from "../services/db";
import { CollectionItem, ItemCategory, ItemStatus } from "../models/types";
import Layout from "../components/Layout";
import NewRecordModal from "../components/NewRecordModal";
import ItemDetailModal from "../components/ItemDetailModal";

const categoryMap: Record<
  string,
  { type: ItemCategory; title: string; icon: any }
> = {
  libros: { type: "BOOKS", title: "LIBROS", icon: Book },
  manga: { type: "MANGA", title: "MANGAS", icon: ScrollText },
  series: { type: "SERIES", title: "SERIES", icon: Tv },
  peliculas: { type: "MOVIES", title: "PELÍCULAS", icon: Film },
  videojuegos: { type: "GAMES", title: "VIDEOJUEGOS", icon: Gamepad2 },
};

type ViewTab = "OWNED" | "WISHLIST";

export default function CategoryView() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ViewTab>("OWNED");
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 Estado para el buscador

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CollectionItem | null>(null);
  const [itemToEdit, setItemToEdit] = useState<CollectionItem | null>(null);

  const currentCategory = categoryId ? categoryMap[categoryId] : null;

  const fetchAndSortData = async () => {
    if (!currentCategory) return;
    setIsLoading(true);
    const allItems = await getCollection();

    let filtered = allItems.filter(
      (item) => item.category === currentCategory.type,
    );

    filtered.sort((a, b) => {
      const aAny = a as any;
      const bAny = b as any;

      if (currentCategory.type === "BOOKS") {
        const authorCompare = (aAny.author || "").localeCompare(
          bAny.author || "",
          "es",
          { sensitivity: "base" },
        );
        if (authorCompare !== 0) return authorCompare;

        const universeCompare = (aAny.universe || "").localeCompare(
          bAny.universe || "",
          "es",
          { sensitivity: "base" },
        );
        if (universeCompare !== 0) return universeCompare;

        const orderA = aAny.universeOrder ?? aAny.sagaOrder ?? 0;
        const orderB = bAny.universeOrder ?? bAny.sagaOrder ?? 0;
        return orderA - orderB;
      }

      if (currentCategory.type === "MANGA") {
        const titleCompare = a.title.localeCompare(b.title, "es", {
          sensitivity: "base",
        });
        if (titleCompare !== 0) return titleCompare;
        return (aAny.volumeNumber || 0) - (bAny.volumeNumber || 0);
      }

      return a.title.localeCompare(b.title, "es", { sensitivity: "base" });
    });

    setItems(filtered);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAndSortData();
  }, [categoryId, currentCategory]);

  const handleSaveItem = async (newItem: CollectionItem) => {
    await saveItem(newItem);
    await fetchAndSortData();
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
    await fetchAndSortData();
  };

  const handleUpdateStatus = async (
    item: CollectionItem,
    newStatus: ItemStatus,
    rating?: number,
  ) => {
    const updated = {
      ...item,
      status: newStatus,
      rating: rating !== undefined ? rating : item.rating,
    };
    await saveItem(updated);
    setSelectedItem(null);
    await fetchAndSortData();
  };

  if (!currentCategory) return null;

  const Icon = currentCategory.icon;

  // Filtramos por pestaña (Posesión vs Deseos) y aplicamos el Buscador en tiempo real
  const baseTabItems = items.filter((item) =>
    activeTab === "OWNED"
      ? item.status === "PENDING" || item.status === "COMPLETED"
      : item.status === "WISHLIST",
  );

  const displayedItems = baseTabItems.filter((item) => {
    const term = searchTerm.toLowerCase();
    const titleMatch = item.title.toLowerCase().includes(term);
    const authorMatch =
      (item as any).author?.toLowerCase().includes(term) || false;
    const universeMatch =
      (item as any).universe?.toLowerCase().includes(term) || false;
    return titleMatch || authorMatch || universeMatch;
  });

  const ownedCount = items.filter(
    (i) => i.status === "PENDING" || i.status === "COMPLETED",
  ).length;
  const wishlistCount = items.filter((i) => i.status === "WISHLIST").length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "text-sl-cyan border-sl-cyan bg-sl-cyan/10";
      case "PENDING":
        return "text-p5-blood border-p5-blood bg-p5-blood/10";
      case "WISHLIST":
        return "text-p5-gold border-p5-gold bg-p5-gold/10";
      default:
        return "text-gray-400 border-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "COMPLETADO";
      case "PENDING":
        return "PENDIENTE";
      case "WISHLIST":
        return "DESEADO";
      default:
        return status;
    }
  };

  // Si es la categoría de libros, agrupamos por Inicial de Autor y Universo los elementos filtrados
  const groupBooks = () => {
    const groups: Record<string, Record<string, CollectionItem[]>> = {};
    displayedItems.forEach((item) => {
      const author = (item as any).author || "Desconocido";
      const initial = author.trim().charAt(0).toUpperCase();
      const universe = (item as any).universe || "Obras Independientes";

      if (!groups[initial]) groups[initial] = {};
      if (!groups[initial][universe]) groups[initial][universe] = [];
      groups[initial][universe].push(item);
    });
    return groups;
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 flex-grow flex flex-col max-w-7xl mx-auto w-full animate-system-open origin-center relative pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b border-neutral-800 pb-4 gap-4">
          <div>
            <Link
              to="/grimorio"
              className="text-gray-500 hover:text-sl-cyan flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-3 transition-colors"
            >
              <ArrowLeft size={14} /> Volver al Archivo Central
            </Link>
            <h2 className="text-3xl text-white font-black tracking-widest uppercase flex items-center gap-3">
              <Icon className="text-sl-cyan" size={32} />
              {currentCategory.title}
            </h2>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-2">
              <span className="text-sl-cyan font-bold">{items.length}</span>{" "}
              REGISTROS EN TOTAL
            </p>
          </div>

          <button
            onClick={() => {
              setItemToEdit(null);
              setIsAddModalOpen(true);
            }}
            className="bg-sl-cyan border border-sl-cyan text-black font-bold text-xs py-2 px-6 -skew-x-6 hover:bg-transparent hover:text-sl-cyan hover:shadow-glow-cyan transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus size={14} className="skew-x-6" />
            <span className="skew-x-6 block tracking-widest">
              AÑADIR A {currentCategory.title}
            </span>
          </button>
        </div>

        {/* BARRA DE PESTAÑAS Y BUSCADOR RÁPIDO */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveTab("OWNED")}
              className={`px-5 py-2.5 text-[10px] font-black tracking-widest uppercase border transform -skew-x-6 transition-all cursor-pointer whitespace-nowrap flex items-center gap-3
                ${activeTab === "OWNED" ? `bg-black border-sl-cyan text-sl-cyan shadow-[4px_4px_0px_rgba(0,229,255,0.4)] scale-105` : "border-neutral-800 text-gray-500 bg-sl-surface hover:border-sl-cyan/50"}
              `}
            >
              <span className="skew-x-6 block">EN POSESIÓN</span>
              <span
                className={`skew-x-6 px-1.5 py-0.5 bg-black border ${activeTab === "OWNED" ? "border-sl-cyan" : "border-neutral-700"}`}
              >
                {ownedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("WISHLIST")}
              className={`px-5 py-2.5 text-[10px] font-black tracking-widest uppercase border transform -skew-x-6 transition-all cursor-pointer whitespace-nowrap flex items-center gap-3
                ${activeTab === "WISHLIST" ? `bg-black border-p5-gold text-p5-gold shadow-[4px_4px_0px_rgba(251,191,36,0.4)] scale-105` : "border-neutral-800 text-gray-500 bg-sl-surface hover:border-p5-gold/50"}
              `}
            >
              <span className="skew-x-6 block">LISTA DE DESEOS</span>
              <span
                className={`skew-x-6 px-1.5 py-0.5 bg-black border ${activeTab === "WISHLIST" ? "border-p5-gold" : "border-neutral-700"}`}
              >
                {wishlistCount}
              </span>
            </button>
          </div>

          {/* BUSCADOR INSTANTÁNEO */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              <Search size={14} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título, autor..."
              className="w-full bg-black/80 border border-neutral-700 text-white text-xs pl-9 pr-3 py-2.5 focus:border-sl-cyan focus:outline-none transition-colors"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-sl-cyan border-t-transparent rounded-full animate-spin shadow-glow-cyan"></div>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-neutral-800 bg-sl-surface/30 p-8 text-center mt-4">
            <div className="text-gray-600 mb-4 opacity-50">
              <Icon size={48} />
            </div>
            <h3 className="text-sm text-gray-400 font-bold tracking-widest uppercase mb-2">
              {searchTerm ? "Sin resultados en la búsqueda" : "Sección Vacía"}
            </h3>
            <p className="text-xs text-gray-600 max-w-sm">
              {searchTerm
                ? `No se ha encontrado ningún registro que coincida con "${searchTerm}".`
                : activeTab === "OWNED"
                  ? "No tienes registros obtenidos en esta categoría."
                  : "Tu lista de deseos está vacía."}
            </p>
          </div>
        ) : currentCategory.type === "BOOKS" ? (
          /* VISTA AGRUPADA POR INICIAL DE AUTOR Y UNIVERSO PARA LIBROS */
          <div className="space-y-8 pb-10">
            {Object.entries(groupBooks()).map(([initial, universes]) => (
              <div key={initial} className="space-y-4">
                <div className="flex items-center gap-3 border-b-2 border-sl-cyan/40 pb-1">
                  <span className="text-4xl font-black text-sl-cyan tracking-tighter drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                    {initial}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    Índice de Autor
                  </span>
                </div>

                {Object.entries(universes).map(([universe, bookList]) => (
                  <div key={universe} className="pl-4 md:pl-8 space-y-3">
                    {universe !== "Obras Independientes" && (
                      <h4 className="text-sm text-p5-gold font-black tracking-widest uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-p5-gold"></span>{" "}
                        {universe}
                      </h4>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {bookList.map((item) => {
                        const itemAny = item as any;
                        return (
                          <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className={`bg-sl-surface/80 border ${item.isSpecialEdition ? "border-p5-gold shadow-[0_0_10px_rgba(251,191,36,0.2)]" : "border-sl-purple/30"} p-3 hover:border-sl-cyan transition-colors group relative overflow-hidden flex flex-col aspect-[2/3] cursor-pointer`}
                          >
                            {item.coverImage ? (
                              <div className="absolute inset-0 z-0">
                                <img
                                  src={item.coverImage}
                                  alt={item.title}
                                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                              </div>
                            ) : (
                              <div className="absolute inset-0 bg-neutral-900/50 -z-10 group-hover:bg-sl-cyan/5 transition-colors"></div>
                            )}

                            {item.isSpecialEdition && (
                              <div className="absolute top-0 right-0 bg-p5-gold text-black px-1.5 py-1 z-10 shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                                <Star size={12} className="fill-black" />
                              </div>
                            )}

                            <div className="flex justify-between items-center mb-auto pt-1 z-10">
                              <span
                                className={`text-[8px] font-black tracking-wider px-2 py-0.5 border ${getStatusStyle(item.status)}`}
                              >
                                {getStatusText(item.status)}
                              </span>

                              {itemAny.universeOrder !== undefined && (
                                <span className="text-[8px] text-sl-cyan bg-black/90 px-1.5 py-0.5 border border-sl-cyan/40 flex items-center gap-0.5 font-bold shadow-md">
                                  <BookOpen size={9} /> #{itemAny.universeOrder}
                                </span>
                              )}
                            </div>

                            <div className="mt-auto bg-black/85 p-2 border-t border-neutral-800 backdrop-blur-sm -mx-3 -mb-3 z-10">
                              <h4 className="text-white font-bold text-xs tracking-wide line-clamp-2 group-hover:text-sl-cyan transition-colors">
                                {item.title}
                              </h4>
                              <div className="mt-1 text-[9px] text-gray-400 uppercase tracking-widest flex justify-between items-center">
                                <span className="truncate">
                                  {itemAny.author}
                                </span>
                                {item.rating !== undefined &&
                                  item.rating > 0 && (
                                    <span className="text-p5-gold font-bold flex items-center gap-0.5">
                                      ★ {item.rating}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* VISTA ESTÁNDAR PARA OTRAS CATEGORÍAS */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-10">
            {displayedItems.map((item) => {
              const itemAny = item as any;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-sl-surface/80 border ${item.isSpecialEdition ? "border-p5-gold shadow-[0_0_10px_rgba(251,191,36,0.2)]" : "border-sl-purple/30"} p-3 hover:border-sl-cyan transition-colors group relative overflow-hidden flex flex-col aspect-[2/3] cursor-pointer`}
                >
                  {item.coverImage ? (
                    <div className="absolute inset-0 z-0">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-neutral-900/50 -z-10 group-hover:bg-sl-cyan/5 transition-colors"></div>
                  )}

                  {item.isSpecialEdition && (
                    <div className="absolute top-0 right-0 bg-p5-gold text-black px-1.5 py-1 z-10 shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                      <Star size={12} className="fill-black" />
                    </div>
                  )}

                  <div className="flex justify-start mb-auto pt-1 z-10">
                    <span
                      className={`text-[8px] font-black tracking-wider px-2 py-0.5 border ${getStatusStyle(item.status)}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </div>

                  <div className="mt-auto bg-black/85 p-2 border-t border-neutral-800 backdrop-blur-sm -mx-3 -mb-3 z-10">
                    <h4 className="text-white font-bold text-xs tracking-wide line-clamp-2 group-hover:text-sl-cyan transition-colors">
                      {item.title}
                    </h4>
                    <div className="mt-1 text-[9px] text-gray-400 uppercase tracking-widest flex justify-between items-center">
                      {currentCategory.type === "MANGA" && (
                        <span>Vol. {itemAny.volumeNumber}</span>
                      )}
                      {currentCategory.type === "GAMES" && (
                        <span>{itemAny.platform}</span>
                      )}
                      {currentCategory.type === "MOVIES" && (
                        <span>
                          {itemAny.durationMinutes
                            ? `${itemAny.durationMinutes} min`
                            : "Película"}
                        </span>
                      )}
                      {currentCategory.type === "SERIES" && <span>Serie</span>}
                      {item.rating !== undefined && item.rating > 0 && (
                        <span className="text-p5-gold font-bold">
                          ★ {item.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NewRecordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveItem}
        fixedCategory={currentCategory.type}
        defaultStatus={activeTab === "OWNED" ? "PENDING" : "WISHLIST"}
        itemToEdit={itemToEdit}
      />

      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={(item) => {
          setSelectedItem(null);
          setItemToEdit(item);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteItem}
        onUpdateStatus={handleUpdateStatus}
      />
    </Layout>
  );
}
