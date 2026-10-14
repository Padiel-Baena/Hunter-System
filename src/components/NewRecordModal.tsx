import { useState, useEffect } from "react";
import { X, Star, Upload, Image as ImageIcon } from "lucide-react";
import { CollectionItem, ItemCategory, ItemStatus } from "../models/types";

interface NewRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: CollectionItem) => Promise<void>;
  fixedCategory?: ItemCategory;
  defaultStatus?: ItemStatus;
  itemToEdit?: CollectionItem | null;
}

export default function NewRecordModal({
  isOpen,
  onClose,
  onSave,
  fixedCategory,
  defaultStatus,
  itemToEdit,
}: NewRecordModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ItemCategory>(
    fixedCategory || "BOOKS",
  );
  const [status, setStatus] = useState<ItemStatus>(defaultStatus || "WISHLIST");
  const [isSpecialEdition, setIsSpecialEdition] = useState(false);
  const [coverImage, setCoverImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Campos específicos
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [universe, setUniverse] = useState("");
  const [universeOrder, setUniverseOrder] = useState("");
  const [saga, setSaga] = useState("");
  const [sagaOrder, setSagaOrder] = useState("");
  const [bookFormat, setBookFormat] = useState<
    "Tapa blanda" | "Tapa dura" | "Ebook" | "Audiolibro"
  >("Tapa blanda");

  const [volumeNumber, setVolumeNumber] = useState("");

  const [gamePlatform, setGamePlatform] = useState<
    "PlayStation" | "Nintendo" | "Xbox" | "PC" | "Móvil"
  >("PC");
  const [gameFormat, setGameFormat] = useState<"Físico" | "Digital">("Digital");

  const [durationMinutes, setDurationMinutes] = useState("");
  const [seasonsCount, setSeasonsCount] = useState("");

  // Sincronizar datos al abrir o al editar
  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setTitle(itemToEdit.title);
        setCategory(itemToEdit.category);
        setStatus(itemToEdit.status);
        setIsSpecialEdition(!!itemToEdit.isSpecialEdition); // Corregido con doble negación
        setCoverImage(itemToEdit.coverImage || "");

        if (itemToEdit.category === "BOOKS") {
          setAuthor((itemToEdit as any).author || "");
          setPages((itemToEdit as any).pages?.toString() || "");
          setUniverse((itemToEdit as any).universe || "");
          setUniverseOrder((itemToEdit as any).universeOrder?.toString() || "");
          setSaga((itemToEdit as any).saga || "");
          setSagaOrder((itemToEdit as any).sagaOrder?.toString() || "");
          setBookFormat((itemToEdit as any).format || "Tapa blanda");
        } else if (itemToEdit.category === "MANGA") {
          setVolumeNumber((itemToEdit as any).volumeNumber?.toString() || "");
          setPages((itemToEdit as any).pages?.toString() || "");
        } else if (itemToEdit.category === "GAMES") {
          setGamePlatform((itemToEdit as any).platform || "PC");
          setGameFormat((itemToEdit as any).format || "Digital");
        } else if (itemToEdit.category === "MOVIES") {
          setSaga((itemToEdit as any).saga || "");
          setSagaOrder((itemToEdit as any).sagaOrder?.toString() || "");
          setDurationMinutes(
            (itemToEdit as any).durationMinutes?.toString() || "",
          );
        } else if (itemToEdit.category === "SERIES") {
          setSeasonsCount(
            (itemToEdit as any).seasons?.length?.toString() || "",
          );
        }
      } else {
        setTitle("");
        setAuthor("");
        setPages("");
        setUniverse("");
        setUniverseOrder("");
        setSaga("");
        setSagaOrder("");
        setVolumeNumber("");
        setDurationMinutes("");
        setSeasonsCount("");
        setCoverImage("");
        setIsSpecialEdition(false);
        if (fixedCategory) setCategory(fixedCategory);
        if (defaultStatus) setStatus(defaultStatus);
      }
    }
  }, [isOpen, itemToEdit, fixedCategory, defaultStatus]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const baseData = {
      id: itemToEdit ? itemToEdit.id : crypto.randomUUID(),
      title,
      status,
      isSpecialEdition,
      coverImage,
      createdAt: itemToEdit ? itemToEdit.createdAt : new Date().toISOString(),
    };

    let fullItem: any = { ...baseData, category };

    if (category === "BOOKS") {
      fullItem = {
        ...fullItem,
        author,
        format: bookFormat,
        pages: pages ? parseInt(pages) : undefined,
        universe: universe || undefined,
        universeOrder: universeOrder ? parseFloat(universeOrder) : undefined,
        saga: saga || undefined,
        sagaOrder: sagaOrder ? parseFloat(sagaOrder) : undefined,
      };
    } else if (category === "MANGA") {
      fullItem = {
        ...fullItem,
        volumeNumber: volumeNumber ? parseFloat(volumeNumber) : 1,
        pages: pages ? parseInt(pages) : undefined,
      };
    } else if (category === "GAMES") {
      fullItem = {
        ...fullItem,
        platform: gamePlatform,
        format: gameFormat,
      };
    } else if (category === "MOVIES") {
      fullItem = {
        ...fullItem,
        saga: saga || undefined,
        sagaOrder: sagaOrder ? parseFloat(sagaOrder) : undefined,
        durationMinutes: durationMinutes
          ? parseInt(durationMinutes)
          : undefined,
        isSpecialEdition: false,
      };
    } else if (category === "SERIES") {
      const numSeasons = seasonsCount ? parseInt(seasonsCount) : 0;
      fullItem = {
        ...fullItem,
        seasons: Array.from({ length: numSeasons }, (_, i) => ({
          seasonNumber: i + 1,
        })),
        isSpecialEdition: false,
      };
    }

    await onSave(fullItem as CollectionItem);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sl-abyss/90 backdrop-blur-sm animate-system-open origin-center overflow-y-auto">
      <div
        className={`bg-sl-surface border ${isSpecialEdition ? "border-p5-gold shadow-[0_0_15px_rgba(251,191,36,0.3)]" : "border-sl-cyan/50 shadow-glow-cyan"} w-full max-w-xl relative p-6 my-auto max-h-[90vh] overflow-y-auto`}
      >
        <div
          className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${isSpecialEdition ? "border-p5-gold" : "border-sl-cyan"}`}
        ></div>
        <div
          className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${isSpecialEdition ? "border-p5-gold" : "border-sl-cyan"}`}
        ></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-p5-blood cursor-pointer z-10"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl text-white font-black tracking-widest uppercase mb-6 border-b border-sl-cyan/30 pb-3 flex items-center gap-2">
          <div className="w-2 h-2 bg-sl-cyan animate-pulse"></div>
          {itemToEdit
            ? "Editar Registro"
            : fixedCategory
              ? `Nuevo Registro (${fixedCategory})`
              : "Sintetizar Nuevo Registro"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 bg-black/40 p-4 relative group">
            <label className="text-[10px] uppercase tracking-widest text-sl-cyan mb-2 font-bold">
              Portada del Registro
            </label>
            <div className="flex items-center gap-4 w-full justify-center">
              <div className="w-20 h-28 border border-neutral-600 bg-neutral-900 flex items-center justify-center overflow-hidden relative">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={24} className="text-neutral-600" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="bg-sl-surface border border-sl-cyan/50 text-sl-cyan text-xs font-bold py-2 px-4 cursor-pointer hover:bg-sl-cyan hover:text-black transition-colors flex items-center gap-2">
                  <Upload size={14} /> Seleccionar Imagen
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage("")}
                    className="text-[10px] text-p5-blood hover:underline text-left"
                  >
                    Eliminar imagen
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-widest text-sl-cyan mb-1 font-bold">
              Título <span className="text-p5-blood">*</span>
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black/50 border border-sl-cyan/40 text-white p-2.5 text-sm outline-none focus:border-sl-cyan focus:shadow-glow-cyan w-full"
              placeholder="Título completo de la obra..."
            />
          </div>

          {!fixedCategory && (
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest text-sl-purple mb-1 font-bold">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="bg-black/50 border border-sl-purple/40 text-white p-2 text-sm outline-none"
              >
                <option value="BOOKS">Libro</option>
                <option value="MANGA">Manga</option>
                <option value="GAMES">Videojuego</option>
                <option value="SERIES">Serie</option>
                <option value="MOVIES">Película</option>
              </select>
            </div>
          )}

          {category === "BOOKS" && (
            <div className="space-y-3 border-l-2 border-sl-purple/50 pl-3 py-1">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Autor <span className="text-p5-blood">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                    placeholder="Nombre del autor"
                  />
                </div>
                <div className="col-span-1 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Nº Páginas
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                    placeholder="Ej: 350"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Universo
                  </label>
                  <input
                    type="text"
                    value={universe}
                    onChange={(e) => setUniverse(e.target.value)}
                    className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                    placeholder="Ej: Cosmere"
                  />
                </div>
                <div className="col-span-1 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Orden Univ.
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={universeOrder}
                    onChange={(e) => setUniverseOrder(e.target.value)}
                    className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                    placeholder="Ej: 2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Saga
                  </label>
                  <input
                    type="text"
                    value={saga}
                    onChange={(e) => setSaga(e.target.value)}
                    className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                    placeholder="Ej: Nacido de la Bruma"
                  />
                </div>
                <div className="col-span-1 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Orden Saga
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={sagaOrder}
                    onChange={(e) => setSagaOrder(e.target.value)}
                    className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                    placeholder="Ej: 1"
                  />
                </div>
              </div>

              <div className="flex flex-col pt-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">
                  Formato del Libro
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    ["Tapa blanda", "Tapa dura", "Ebook", "Audiolibro"] as const
                  ).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setBookFormat(fmt)}
                      className={`py-2 px-3 text-[10px] font-bold uppercase border transition-all cursor-pointer ${bookFormat === fmt ? "border-sl-cyan bg-sl-cyan/20 text-sl-cyan shadow-glow-cyan" : "border-neutral-700 bg-black/50 text-gray-400"}`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {category === "MANGA" && (
            <div className="grid grid-cols-3 gap-3 border-l-2 border-sl-purple/50 pl-3 py-1">
              <div className="col-span-2 flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                  Número de Tomo <span className="text-p5-blood">*</span>
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  min="0"
                  value={volumeNumber}
                  onChange={(e) => setVolumeNumber(e.target.value)}
                  className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                  placeholder="Ej: 1"
                />
              </div>
              <div className="col-span-1 flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                  Páginas
                </label>
                <input
                  type="number"
                  min="1"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                />
              </div>
            </div>
          )}

          {category === "GAMES" && (
            <div className="grid grid-cols-2 gap-3 border-l-2 border-sl-purple/50 pl-3 py-1">
              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                  Plataforma
                </label>
                <select
                  value={gamePlatform}
                  onChange={(e) => setGamePlatform(e.target.value as any)}
                  className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none"
                >
                  <option value="PlayStation">PlayStation</option>
                  <option value="Nintendo">Nintendo</option>
                  <option value="Xbox">Xbox</option>
                  <option value="PC">PC</option>
                  <option value="Móvil">Móvil</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                  Formato
                </label>
                <select
                  value={gameFormat}
                  onChange={(e) => setGameFormat(e.target.value as any)}
                  className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none"
                >
                  <option value="Digital">Digital</option>
                  <option value="Físico">Físico</option>
                </select>
              </div>
            </div>
          )}

          {category === "MOVIES" && (
            <div className="space-y-3 border-l-2 border-sl-purple/50 pl-3 py-1">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Saga
                  </label>
                  <input
                    type="text"
                    value={saga}
                    onChange={(e) => setSaga(e.target.value)}
                    className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                    placeholder="Ej: Star Wars"
                  />
                </div>
                <div className="col-span-1 flex flex-col">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Orden Saga
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={sagaOrder}
                    onChange={(e) => setSagaOrder(e.target.value)}
                    className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                    placeholder="Ej: 4"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  min="1"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                  placeholder="Ej: 145"
                />
              </div>
            </div>
          )}

          {category === "SERIES" && (
            <div className="flex flex-col border-l-2 border-sl-purple/50 pl-3 py-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                Número de Temporadas
              </label>
              <input
                type="number"
                min="1"
                value={seasonsCount}
                onChange={(e) => setSeasonsCount(e.target.value)}
                className="bg-black/50 border border-neutral-700 text-white p-2 text-sm outline-none focus:border-sl-cyan"
                placeholder="Ej: 3"
              />
            </div>
          )}

          {(category === "BOOKS" ||
            category === "MANGA" ||
            category === "GAMES") && (
            <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`w-5 h-5 border flex items-center justify-center transition-colors ${isSpecialEdition ? "border-p5-gold bg-p5-gold/20" : "border-neutral-600 bg-black/50"}`}
                >
                  {isSpecialEdition && (
                    <Star size={12} className="text-p5-gold fill-p5-gold" />
                  )}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isSpecialEdition}
                  onChange={(e) => setIsSpecialEdition(e.target.checked)}
                />
                <span
                  className={`text-xs font-bold tracking-wider uppercase ${isSpecialEdition ? "text-p5-gold" : "text-gray-400"}`}
                >
                  Edición Especial
                </span>
              </label>
            </div>
          )}

          <div className="flex flex-col pt-2">
            <label className="text-[10px] uppercase tracking-widest text-p5-gold mb-1 font-bold">
              Estado en el Sistema
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ItemStatus)}
              className="bg-black/50 border border-p5-gold/40 text-white p-2 text-sm outline-none"
            >
              <option value="WISHLIST">Lista de Deseos</option>
              <option value="PENDING">En Posesión (Pendiente)</option>
              <option value="COMPLETED">Completado</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-p5-blood border border-p5-blood text-white font-bold text-sm py-3 -skew-x-2 hover:bg-transparent hover:text-p5-blood transition-colors group relative overflow-hidden cursor-pointer disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
            <span className="skew-x-2 block relative z-10 tracking-widest">
              {isSubmitting
                ? "GUARDANDO..."
                : itemToEdit
                  ? "ACTUALIZAR REGISTRO"
                  : "SINTETIZAR REGISTRO"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
