import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Settings,
  User,
  Award,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { getCollection, getProfile, saveProfile } from "../services/db";
import { CollectionItem, HunterProfile } from "../models/types";
import { AVAILABLE_PETS } from "../utils/petUtils";
import Layout from "../components/Layout";

export default function Sistema() {
  const [profile, setProfile] = useState<HunterProfile>({
    name: "Cazador",
    equippedTitle: "Recién Despertado",
    selectedMascotId: "fenix",
    activeCategories: ["BOOKS", "MANGA", "GAMES", "SERIES", "MOVIES"],
  });
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSystemData = async () => {
      const pData = await getProfile();
      if (pData) setProfile(pData);
      const cData = await getCollection();
      setItems(cData);
    };
    loadSystemData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await saveProfile(profile);
    setIsSaving(false);
    setSaveMessage("Parámetros de perfil actualizados con éxito.");
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleClearDatabase = async () => {
    if (
      window.confirm(
        "¡ADVERTENCIA CRÍTICA! Esto borrará permanentemente todos los registros de tu Grimorio y restablecerá el sistema. ¿Estás absolutamente seguro?",
      )
    ) {
      indexedDB.deleteDatabase("grimorio-system-db");
      window.location.reload();
    }
  };

  // Cálculo de títulos desbloqueados basados en completados
  const completedCount = items.filter((i) => i.status === "COMPLETED").length;
  const booksCompleted = items.filter(
    (i) => i.category === "BOOKS" && i.status === "COMPLETED",
  ).length;
  const mangaCompleted = items.filter(
    (i) => i.category === "MANGA" && i.status === "COMPLETED",
  ).length;
  const gamesCompleted = items.filter(
    (i) => i.category === "GAMES" && i.status === "COMPLETED",
  ).length;

  const availableTitles = [
    {
      title: "Recién Despertado",
      unlocked: true,
      desc: "Disponible desde el inicio.",
    },
    {
      title: "Cazador de Bronce",
      unlocked: completedCount >= 5,
      desc: "Requiere 5 obras completadas.",
    },
    {
      title: "Bibliófilo Arcano",
      unlocked: booksCompleted >= 3,
      desc: "Requiere 3 libros completados.",
    },
    {
      title: "Cronista del Manga",
      unlocked: mangaCompleted >= 10,
      desc: "Requiere 10 tomos de manga completados.",
    },
    {
      title: "Maestro de Mazmorras",
      unlocked: gamesCompleted >= 5,
      desc: "Requiere 5 videojuegos completados.",
    },
    {
      title: "Cazador Leyenda (SSS)",
      unlocked: completedCount >= 120,
      desc: "Requiere 120 obras completadas.",
    },
  ];

  return (
    <Layout>
      <div className="p-4 md:p-8 flex-grow flex flex-col max-w-5xl mx-auto w-full animate-system-open origin-center relative pb-20">
        {/* Cabecera con Botón de Retorno al Inicio */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-p5-blood/30 pb-4 gap-4">
          <div className="flex flex-col gap-4">
            <Link
              to="/dashboard"
              className="bg-sl-surface border border-neutral-700 text-gray-300 hover:text-p5-blood hover:border-p5-blood px-3 py-2 text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 transform -skew-x-6 cursor-pointer w-fit"
            >
              <ArrowLeft size={14} className="skew-x-6" />{" "}
              <span className="skew-x-6">INICIO</span>
            </Link>

            <div>
              <p className="text-[10px] text-p5-blood font-bold tracking-widest uppercase mb-1">
                Configuración Central del Sistema
              </p>
              <h2 className="text-3xl text-white font-black tracking-widest uppercase flex items-center gap-3">
                <Settings className="text-p5-blood" size={32} />
                Panel de Sistema
              </h2>
              <p className="text-xs text-gray-400 tracking-widest uppercase mt-1">
                Gestión de perfil, títulos y elección de mascota
              </p>
            </div>
          </div>
        </div>

        {saveMessage && (
          <div className="p-4 mb-6 border bg-sl-cyan/10 border-sl-cyan text-sl-cyan flex items-center gap-3">
            <CheckCircle2 size={20} />
            <span className="text-xs font-bold tracking-wider uppercase">
              {saveMessage}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Perfil del Cazador y Selección de Mascota */}
          <div className="bg-sl-surface/80 border border-p5-blood/40 p-6 relative flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-p5-blood"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-p5-blood"></div>

            <h3 className="text-xl text-white font-black tracking-wide uppercase mb-4 flex items-center gap-2">
              <User size={18} className="text-p5-blood" /> Identidad y Entidad
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-p5-blood mb-1 font-bold">
                  Nombre de Cazador
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  className="bg-black/50 border border-neutral-700 text-white p-2.5 text-sm outline-none focus:border-p5-blood"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-p5-blood mb-1 font-bold">
                  Título Equipado Actualmente
                </label>
                <select
                  value={profile.equippedTitle}
                  onChange={(e) =>
                    setProfile({ ...profile, equippedTitle: e.target.value })
                  }
                  className="bg-black/50 border border-neutral-700 text-white p-2.5 text-sm outline-none focus:border-p5-blood cursor-pointer font-bold"
                >
                  {availableTitles
                    .filter((t) => t.unlocked)
                    .map((t) => (
                      <option key={t.title} value={t.title}>
                        {t.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-sl-purple mb-1 font-bold">
                  Seleccionar Mascota Abisal
                </label>
                <select
                  value={profile.selectedMascotId}
                  onChange={(e) =>
                    setProfile({ ...profile, selectedMascotId: e.target.value })
                  }
                  className="bg-black/50 border border-sl-purple/40 text-white p-2.5 text-sm outline-none focus:border-sl-purple cursor-pointer font-bold uppercase"
                >
                  {AVAILABLE_PETS.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-p5-blood border border-p5-blood text-white font-black text-xs py-3 -skew-x-2 hover:bg-transparent hover:text-p5-blood transition-colors cursor-pointer mt-4"
              >
                <span className="skew-x-2 tracking-widest">
                  GUARDAR PARÁMETROS
                </span>
              </button>
            </form>
          </div>

          {/* Títulos del Cazador Desbloqueables */}
          <div className="bg-sl-surface/80 border border-p5-blood/40 p-6 relative flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-p5-blood"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-p5-blood"></div>

            <div>
              <h3 className="text-xl text-white font-black tracking-wide uppercase mb-4 flex items-center gap-2">
                <Award size={18} className="text-p5-blood" /> Títulos
                Honoríficos
              </h3>

              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {availableTitles.map((t) => (
                  <div
                    key={t.title}
                    className={`p-2.5 border text-xs flex justify-between items-center ${t.unlocked ? "border-p5-blood/40 bg-black/40 text-white" : "border-neutral-800 bg-neutral-900/30 text-gray-600"}`}
                  >
                    <div>
                      <span className="font-bold tracking-wide uppercase block">
                        {t.title}
                      </span>
                      <span className="text-[9px] text-gray-500">{t.desc}</span>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 border ${t.unlocked ? "border-p5-blood text-p5-blood" : "border-neutral-800 text-gray-600"}`}
                    >
                      {t.unlocked ? "DESBLOQUEADO" : "BLOQUEADO"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Apartado Legal y Términos de Uso */}
        <div className="bg-sl-surface/80 border border-neutral-700 p-6 relative mb-8">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neutral-500"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neutral-500"></div>

          <h3 className="text-sm text-white font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
            <ShieldCheck size={18} className="text-sl-cyan" /> Avisos Legales y
            Términos del Sistema
          </h3>
          <div className="text-xs text-gray-400 space-y-3 leading-relaxed">
            <p>
              <strong className="text-white">
                1. Almacenamiento Local (IndexedDB):
              </strong>{" "}
              Este sistema opera de forma totalmente autónoma y descentralizada
              en tu dispositivo local mediante bases de datos IndexedDB. Ningún
              registro personal, colección o dato de usuario se transmite a
              servidores externos.
            </p>
            <p>
              <strong className="text-white">2. Privacidad Absoluta:</strong>{" "}
              Tus hábitos de lectura, consumo cultural, notas y valoraciones
              están estrictamente blindados en el almacenamiento de tu
              navegador. Eres el único propietario y custodio de la base de
              datos.
            </p>
            <p>
              <strong className="text-white">
                3. Propiedad Estética e Intelectual:
              </strong>{" "}
              La interfaz y los códigos visuales están inspirados en los diseños
              de interfaz de usuario de videojuegos de rol táctico, diseñados
              exclusivamente para uso personal, recreativo y de organización de
              colecciones privadas.
            </p>
          </div>
        </div>

        {/* Zona de Peligro / Datos */}
        <div className="bg-sl-surface/50 border border-p5-blood/30 p-6 relative">
          <h3 className="text-sm text-p5-blood font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
            <AlertTriangle size={16} /> Zona de Datos del Sistema
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Operaciones críticas de almacenamiento local. Utiliza estas
            herramientas únicamente bajo tu propia responsabilidad.
          </p>

          <button
            onClick={handleClearDatabase}
            className="bg-black border border-p5-blood text-p5-blood hover:bg-p5-blood hover:text-white py-2.5 px-6 text-xs font-black tracking-widest uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_10px_rgba(230,0,18,0.3)]"
          >
            <Trash2 size={14} /> REINICIO DE FÁBRICA (BORRAR TODO)
          </button>
        </div>
      </div>
    </Layout>
  );
}
