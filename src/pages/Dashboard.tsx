import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, Book, Swords, Settings, Trophy } from "lucide-react";
import { getCollection, getProfile } from "../services/db";
import { CollectionItem, HunterProfile } from "../models/types";
import { calculateHunterRank } from "../utils/rankUtils";
import { getPetStageAndImage, AVAILABLE_PETS, PetId } from "../utils/petUtils";

export default function Dashboard() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [profile, setProfile] = useState<HunterProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      const data = await getCollection();
      const pData = await getProfile();
      setItems(data);
      if (pData) setProfile(pData);
      setIsLoading(false);
    };
    loadDashboardData();
  }, []);

  // Cálculos dinámicos basados en la base de datos real
  const completedCount = items.filter((i) => i.status === "COMPLETED").length;
  const pendingCount = items.filter((i) => i.status === "PENDING").length;
  const wishlistCount = items.filter((i) => i.status === "WISHLIST").length;

  // Cálculo del rango por cantidad
  const rankInfo = calculateHunterRank(completedCount);

  // Datos de la mascota basados en el perfil y las obras completadas
  const selectedPetId = (profile?.selectedMascotId as PetId) || "fenix";
  const currentPetObj =
    AVAILABLE_PETS.find((p) => p.id === selectedPetId) || AVAILABLE_PETS[3];
  const petDetails = getPetStageAndImage(completedCount, selectedPetId);

  // Cálculo del Índice de Corrupción
  const obtainedTotal = pendingCount + completedCount;
  const corruptionValue =
    obtainedTotal > 0 ? Math.round((100 * pendingCount) / obtainedTotal) : 0;

  let corruptionStatus = "ESTABLE";
  let corruptionColor = "text-sl-cyan";
  if (corruptionValue >= 76) {
    corruptionStatus = "ESTADO CRÍTICO";
    corruptionColor = "text-p5-blood";
  } else if (corruptionValue >= 56) {
    corruptionStatus = "PELIGRO";
    corruptionColor = "text-p5-blood";
  } else if (corruptionValue >= 36) {
    corruptionStatus = "INESTABLE";
    corruptionColor = "text-yellow-500";
  } else if (corruptionValue >= 16) {
    corruptionStatus = "CONTROLADO";
    corruptionColor = "text-sl-purple";
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-sl-abyss text-p5-paper font-system pb-20 lg:pb-0 overflow-y-auto lg:overflow-hidden">
      {/* PANEL IZQUIERDO: CAZADOR Y ENTIDAD (1/3) */}
      <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-sl-purple/30 bg-sl-surface/50 p-6 flex flex-col justify-between relative">
        <div className="absolute top-0 right-0 bg-sl-purple text-white text-[9px] font-bold px-2.5 py-0.5 tracking-widest z-10">
          ENTIDAD_VINCULADA
        </div>

        <div className="flex flex-col items-center text-center mt-2">
          <h3 className="text-2xl text-white font-black tracking-widest uppercase drop-shadow-[0_0_8px_rgba(139,92,246,0.6)] mb-2">
            {profile?.name || "Cazador"}
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <span
              className={`font-bold text-xs border px-4 py-1 ${rankInfo.color}`}
            >
              RANGO {rankInfo.name}
            </span>
            <span className="text-p5-purple font-black text-[11px] transform -skew-x-6 shadow-[2px_2px_0px_#fff] bg-black px-2 py-1">
              {profile?.equippedTitle || "Recién Despertado"}
            </span>
          </div>

          {/* Barra de Progreso de Rango Dinámica */}
          <div className="w-full max-w-[220px]">
            <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">
              <span>PROGRESO DE RANGO</span>
              <span className="text-sl-purple">{completedCount} Obras</span>
            </div>
            <div className="h-1.5 w-full bg-neutral-900 border border-neutral-700 overflow-hidden">
              <div
                className="h-full bg-sl-purple shadow-[0_0_8px_rgba(139,92,246,0.8)] transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(rankInfo.progressPercent, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Zona de Mascota / Entidad Dinámica */}
        <div className="w-full my-6 border-2 border-dashed border-sl-purple/30 flex flex-col items-center justify-center bg-sl-abyss/50 py-6 relative px-2">
          <span className="absolute top-2 text-sl-purple font-bold text-[10px] uppercase tracking-widest">
            {currentPetObj.name} Abisal
          </span>
          <div className="flex items-center justify-center h-28 w-28 relative mt-4">
            <img
              src={petDetails.imagePath}
              alt={currentPetObj.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] animate-pulse"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <span className="text-[9px] text-gray-400 mt-2 uppercase tracking-wider font-bold">
            {petDetails.stageName}
          </span>
        </div>

        <div className="text-center text-[9px] text-gray-600 uppercase tracking-widest">
          SISTEMA DE CAZADOR V1.0 // ONLINE
        </div>
      </div>

      {/* PANEL DERECHO: REGISTROS Y ESTADÍSTICAS (2/3) */}
      <div className="w-full lg:w-2/3 p-6 flex flex-col justify-between overflow-y-auto bg-sl-abyss">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-sl-cyan/30 pb-3 gap-3">
          <h3 className="text-sl-cyan font-bold tracking-widest uppercase text-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-sl-cyan animate-pulse"></div>[
            Registros del Sistema ]
          </h3>

          <div className="flex items-center gap-3">
            {/* Acceso Directo al Salón de Trofeos */}
            <Link
              to="/salon"
              className="bg-sl-surface border border-sl-purple text-sl-purple hover:bg-sl-purple hover:text-white px-3 py-1.5 text-[10px] font-black tracking-widest uppercase transition-colors flex items-center gap-2 transform -skew-x-6 cursor-pointer shadow-[0_0_10px_rgba(139,92,246,0.3)]"
            >
              <Trophy size={14} className="skew-x-6" />
              <span className="skew-x-6">SALÓN DE TROFEOS</span>
            </Link>

            <div className="border border-sl-cyan/40 bg-sl-surface/80 px-3 py-1 flex items-center gap-2 shadow-glow-cyan">
              <div className="w-2 h-2 bg-sl-cyan rounded-full animate-ping"></div>
              <span className="text-[10px] text-sl-cyan font-bold tracking-widest">
                SINCRONIZADO
              </span>
            </div>
          </div>
        </div>

        {/* Contadores Principales (Los 3 Estados) */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center text-[10px] font-black uppercase tracking-widest">
          <div className="bg-sl-surface border-b-2 border-sl-cyan p-3 shadow-md">
            <span className="text-sl-cyan block mb-1">COMPLETADOS</span>
            <span className="text-2xl text-white font-system">
              {isLoading ? "..." : completedCount}
            </span>
          </div>
          <div className="bg-sl-surface border-b-2 border-p5-blood p-3 shadow-md">
            <span className="text-p5-blood block mb-1">PENDIENTES</span>
            <span className="text-2xl text-white font-system">
              {isLoading ? "..." : pendingCount}
            </span>
          </div>
          <div className="bg-sl-surface border-b-2 border-yellow-500 p-3 shadow-md">
            <span className="text-yellow-500 block mb-1">DESEOS</span>
            <span className="text-2xl text-white font-system">
              {isLoading ? "..." : wishlistCount}
            </span>
          </div>
        </div>

        {/* Índice de Corrupción */}
        <div className="bg-sl-surface border border-neutral-800 p-4 mb-6 shadow-md">
          <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-widest mb-2">
            <span>Tasa de purga (Archivos Obtenidos: {obtainedTotal})</span>
            <span className={corruptionColor}>{corruptionValue}%</span>
          </div>

          <div className="h-3 w-full bg-neutral-900 border border-neutral-700 flex overflow-hidden shadow-inner">
            <div
              className="h-full bg-sl-cyan transition-all duration-1000 ease-out"
              style={{
                width: `${
                  obtainedTotal > 0
                    ? (completedCount / obtainedTotal) * 100
                    : 50
                }%`,
              }}
            ></div>
            <div
              className="h-full bg-p5-blood transition-all duration-1000 ease-out"
              style={{
                width: `${
                  obtainedTotal > 0 ? (pendingCount / obtainedTotal) * 100 : 50
                }%`,
              }}
            ></div>
          </div>

          <div className="flex justify-between items-center mt-2 text-[10px]">
            <span className="text-gray-500 uppercase">
              Fórmula: 100 × Pendientes / (Pendientes + Completados)
            </span>
            <span
              className={`uppercase tracking-widest font-bold ${corruptionColor}`}
            >
              Estado: {corruptionStatus}
            </span>
          </div>
        </div>

        {/* Terminal del Gremio */}
        <div className="bg-sl-surface border-l-4 border-sl-purple p-3 mb-6 relative shadow-md">
          <div className="absolute -top-2 left-2 bg-sl-purple px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
            Red de Cazadores
          </div>
          <p className="text-xs text-white font-bold truncate mt-2">
            {items.length === 0
              ? "Sistema operativo sin registros de colección activos."
              : `Mascota sincronizada y creciendo con tus logros.`}
          </p>
        </div>

        {/* Botonera Principal (P5R) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-auto">
          <Link
            to="/grimorio"
            className="group relative bg-sl-surface border border-sl-cyan/50 text-center py-3 overflow-hidden hover:border-sl-cyan transition-all block"
          >
            <div className="absolute inset-0 bg-sl-cyan transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
            <span className="relative z-10 text-xs font-bold tracking-wider text-sl-cyan group-hover:text-black transition-colors flex items-center justify-center gap-1">
              <Book size={14} /> GRIMORIO
            </span>
          </Link>

          <Link
            to="/salon"
            className="group relative bg-sl-surface border border-sl-purple/50 text-center py-3 overflow-hidden hover:border-sl-purple transition-all block"
          >
            <div className="absolute inset-0 bg-sl-purple transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
            <span className="relative z-10 text-xs font-bold tracking-wider text-sl-purple group-hover:text-white transition-colors flex items-center justify-center gap-1">
              <Trophy size={14} /> SALÓN
            </span>
          </Link>

          <Link
            to="/gremio"
            className="group relative bg-sl-surface border border-sl-purple/50 text-center py-3 overflow-hidden hover:border-sl-purple transition-all block"
          >
            <div className="absolute inset-0 bg-sl-purple transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
            <span className="relative z-10 text-xs font-bold tracking-wider text-sl-purple group-hover:text-white transition-colors flex items-center justify-center gap-1">
              <Swords size={14} /> GREMIO
            </span>
          </Link>

          <Link
            to="/oraculo"
            className="group relative bg-sl-surface border border-yellow-500/50 text-center py-3 overflow-hidden hover:border-yellow-500 transition-all block"
          >
            <div className="absolute inset-0 bg-yellow-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
            <span className="relative z-10 text-xs font-bold tracking-wider text-yellow-500 group-hover:text-black transition-colors flex items-center justify-center gap-1">
              <Activity size={14} /> ORÁCULO
            </span>
          </Link>

          <Link
            to="/sistema"
            className="group relative bg-sl-surface border border-p5-blood/50 text-center py-3 overflow-hidden hover:border-p5-blood transition-all block"
          >
            <div className="absolute inset-0 bg-p5-blood transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
            <span className="relative z-10 text-xs font-bold tracking-wider text-p5-blood group-hover:text-white transition-colors flex items-center justify-center gap-1">
              <Settings size={14} /> SISTEMA
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
