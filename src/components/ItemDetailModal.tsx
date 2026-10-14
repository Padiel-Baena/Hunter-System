import { useState, useEffect } from "react";
import { X, Star, Trash2, CheckCircle2, Bookmark, Heart } from "lucide-react";
import { CollectionItem, ItemStatus } from "../models/types";

interface ItemDetailModalProps {
  item: CollectionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: CollectionItem) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (
    item: CollectionItem,
    newStatus: ItemStatus,
    rating?: number,
  ) => void;
}

export default function ItemDetailModal({
  item,
  isOpen,
  onClose,
  onDelete,
  onUpdateStatus,
}: ItemDetailModalProps) {
  const [rating, setRating] = useState<number>(5);

  useEffect(() => {
    if (item && (item as any).rating) {
      setRating((item as any).rating);
    } else {
      setRating(5);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const itemAny = item as any;

  const handleTransition = (targetStatus: ItemStatus) => {
    if (targetStatus === "COMPLETED") {
      onUpdateStatus({ ...item, rating }, "COMPLETED", rating);
      onClose();
    } else {
      onUpdateStatus({ ...item, rating: undefined }, targetStatus, undefined);
      onClose();
    }
  };

  const handleRatingSubmit = () => {
    onUpdateStatus({ ...item, rating }, "COMPLETED", rating);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-sl-surface border-2 border-sl-cyan w-full max-w-2xl p-6 relative shadow-[0_0_30px_rgba(0,229,255,0.3)] animate-system-open">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-sl-cyan"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-sl-cyan"></div>

        <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-3">
          <span className="text-[10px] font-black tracking-widest uppercase px-2.5 py-1 border border-sl-cyan bg-sl-cyan/10 text-sl-cyan">
            REGISTRO: {item.category}
          </span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Portada */}
          <div className="w-full h-64 md:h-full border border-neutral-700 bg-neutral-900 overflow-hidden relative flex-shrink-0 shadow-lg">
            {item.coverImage ? (
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs font-bold uppercase">
                Sin Portada
              </div>
            )}
            {item.isSpecialEdition && (
              <div className="absolute top-0 right-0 bg-p5-gold text-black px-2 py-1 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Star size={12} className="fill-black" /> Especial
              </div>
            )}
          </div>

          {/* Información del Objeto */}
          <div className="md:col-span-2 flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-2xl text-white font-black tracking-wide uppercase mb-2">
                {item.title}
              </h2>

              <div className="space-y-1.5 text-xs text-gray-300 mb-4 bg-black/40 p-3 border border-neutral-800">
                {itemAny.author && (
                  <p>
                    <strong className="text-sl-cyan uppercase tracking-wider text-[10px]">
                      Autor:
                    </strong>{" "}
                    {itemAny.author}
                  </p>
                )}
                {itemAny.universe && (
                  <p>
                    <strong className="text-sl-cyan uppercase tracking-wider text-[10px]">
                      Universo:
                    </strong>{" "}
                    {itemAny.universe}{" "}
                    {itemAny.universeOrder !== undefined &&
                      `(Orden: #${itemAny.universeOrder})`}
                  </p>
                )}
                {itemAny.saga && (
                  <p>
                    <strong className="text-sl-cyan uppercase tracking-wider text-[10px]">
                      Saga:
                    </strong>{" "}
                    {itemAny.saga}{" "}
                    {itemAny.sagaOrder !== undefined &&
                      `(Orden: #${itemAny.sagaOrder})`}
                  </p>
                )}
                {itemAny.volumeNumber !== undefined && (
                  <p>
                    <strong className="text-sl-cyan uppercase tracking-wider text-[10px]">
                      Tomo:
                    </strong>{" "}
                    #{itemAny.volumeNumber}
                  </p>
                )}
                {itemAny.format && (
                  <p>
                    <strong className="text-sl-cyan uppercase tracking-wider text-[10px]">
                      Formato:
                    </strong>{" "}
                    {itemAny.format}
                  </p>
                )}
                <p>
                  <strong className="text-sl-cyan uppercase tracking-wider text-[10px]">
                    Estado Actual:
                  </strong>{" "}
                  <span className="uppercase text-white font-bold">
                    {item.status}
                  </span>
                </p>
              </div>
            </div>

            {/* SECCIÓN DE ESTRELLAS CON CORTE EXACTO EN LA MITAD */}
            {item.status === "COMPLETED" && (
              <div className="bg-black/60 p-3 border border-p5-gold/40">
                <label className="text-[10px] text-p5-gold font-bold tracking-widest uppercase mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-p5-gold" /> Puntuación de
                    Conquista
                  </span>
                  <span className="text-p5-gold font-black">{rating} ★</span>
                </label>

                <div className="flex items-center justify-center gap-2 py-2 bg-black/40 border border-neutral-800">
                  {[1, 2, 3, 4, 5].map((starIndex) => {
                    const fillLevel = Math.max(
                      0,
                      Math.min(1, rating - (starIndex - 1)),
                    );

                    return (
                      <div
                        key={starIndex}
                        className="relative w-8 h-8 flex items-center justify-center cursor-pointer"
                      >
                        {/* Mitad izquierda para 0.5 */}
                        <div
                          className="absolute left-0 top-0 w-1/2 h-full z-20"
                          onClick={() => setRating(starIndex - 0.5)}
                        />
                        {/* Mitad derecha para entero */}
                        <div
                          className="absolute right-0 top-0 w-1/2 h-full z-20"
                          onClick={() => setRating(starIndex)}
                        />

                        {/* Fondo de estrella gris */}
                        <Star size={28} className="absolute text-neutral-700" />

                        {/* Relleno exacto con máscara de porcentaje */}
                        {fillLevel > 0 && (
                          <div
                            className="absolute left-0 top-0 h-full overflow-hidden pointer-events-none"
                            style={{ width: `${fillLevel * 100}%` }}
                          >
                            <div className="w-8 h-8 flex items-center justify-center">
                              <Star
                                size={28}
                                className="text-p5-gold fill-p5-gold flex-shrink-0"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleRatingSubmit}
                  className="mt-3 w-full bg-p5-gold/20 border border-p5-gold text-p5-gold text-[10px] font-black uppercase py-2 hover:bg-p5-gold hover:text-black transition-colors cursor-pointer"
                >
                  Guardar Puntuación
                </button>
              </div>
            )}

            {/* ACCIONES DE ESTADO */}
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <span className="text-[9px] text-gray-400 uppercase tracking-widest block font-bold">
                Acción de Estado:
              </span>
              <div className="flex gap-2">
                {item.status === "WISHLIST" && (
                  <button
                    onClick={() => handleTransition("PENDING")}
                    className="w-full py-2.5 text-xs font-black uppercase border tracking-wider bg-black text-sl-cyan border-sl-cyan hover:bg-sl-cyan/10 transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Bookmark size={14} /> Mover a Posesión (Tengo)
                  </button>
                )}

                {item.status === "PENDING" && (
                  <button
                    onClick={() => handleTransition("COMPLETED")}
                    className="w-full py-2.5 text-xs font-black uppercase border tracking-wider bg-black text-sl-purple border-sl-purple hover:bg-sl-purple/10 transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 size={14} /> Marcar como Completado
                  </button>
                )}

                {item.status === "COMPLETED" && (
                  <button
                    onClick={() => handleTransition("PENDING")}
                    className="w-full py-2 text-[10px] font-bold uppercase border border-neutral-700 text-gray-400 bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    Regresar a Pendiente
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Deseas eliminar permanentemente este registro del sistema?",
                    )
                  ) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
                className="text-p5-blood hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 size={14} /> Eliminar Registro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
